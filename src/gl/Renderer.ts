import {
  type BufferInfo,
  type FramebufferInfo,
  type ProgramInfo,
  type VertexArrayInfo,
  bindFramebufferInfo,
  createFramebufferInfo,
  createProgramInfo,
  createVertexArrayInfo,
  drawBufferInfo,
  m4,
  primitives,
  resizeCanvasToDisplaySize,
  resizeFramebufferInfo,
  setBuffersAndAttributes,
  setUniforms,
} from "twgl.js";

import type { TempoData } from "../audio/Analyser";
import type { MIDIMix } from "../midi/MIDIMix";
import { RenderManager } from "./RenderManager";
import { AsciiPass } from "./postfx/AsciiPass";
import { BloomPass } from "./postfx/BloomPass";
import { ConvolutionPass } from "./postfx/ConvolutionPass";
import { FeedbackPass } from "./postfx/FeedbackPass";
import { GridShiftPass } from "./postfx/GridShiftPass";
import { KaleidoscopePass } from "./postfx/KaleidoscopePass";
import { PxGridPass } from "./postfx/PxGridPass";
import { RGBShiftPass } from "./postfx/RGBShiftPass";
import type { RenderPass } from "./postfx/RenderPass";
import { WarpPass } from "./postfx/WarpPass";
import basicFrag from "./shaders/basic.frag.glsl";
import basicVert from "./shaders/basic.vert.glsl";
import screenFrag from "./shaders/screen.frag.glsl";
import screenVert from "./shaders/screen.vert.glsl";
import type { RenderContext } from "./types";
import type { GamepadManager } from "../gamepad/gamepad";

type Vec4 = [number, number, number, number];
type Vec3 = [number, number, number];

export class Renderer {
  readonly gl: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;

  readonly midiMix: MIDIMix;
  readonly gamepad: GamepadManager;

  mainProgramInfo: ProgramInfo;
  passThroughProgramInfo: ProgramInfo;

  globalUniforms: {
    u_lightWorldPos: Vec3;
    u_lightColor: Vec4;
    u_ambient: Vec4;
    u_specular: Vec4;
    u_shininess: number;
    u_specularFactor: number;
    u_view: m4.Mat4;
    u_projection: m4.Mat4;
  };
  styleUniforms: {
    u_colorMult: Vec4;
  };

  objectUniforms: {
    u_world: m4.Mat4;
  };

  primatives: {
    rect: VertexArrayInfo;
    ball: VertexArrayInfo;
    box: VertexArrayInfo;
  };

  frame = 0;
  time = 0;

  fftData?: Float32Array;
  tempoData?: TempoData;

  passes: {
    kaleidoscope: KaleidoscopePass;
    grid: GridShiftPass;
    px: PxGridPass;
    rgb: RGBShiftPass;
    convolution: ConvolutionPass;
    bloom: BloomPass;
    feedback: FeedbackPass;
    warp: WarpPass;
    ascii: AsciiPass;
  };

  screenBufferInfo: BufferInfo;

  currentFramebufferPingPongIndex: number;

  framebuffersPingPong: FramebufferInfo[];

  constructor(
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    midiMix: MIDIMix,
    gamepad: GamepadManager,
  ) {
    this.gl = gl;
    this.canvas = canvas;
    this.midiMix = midiMix;
    this.gamepad = gamepad;

    this.mainProgramInfo = this.createMainProgram();
    this.passThroughProgramInfo = this.createPassThroughProgram();

    this.globalUniforms = {
      u_lightWorldPos: [1, 8, -10],
      u_lightColor: [0.8, 0.8, 0.8, 1],
      u_ambient: [0.2, 0.2, 0.2, 1],
      u_specular: [1, 1, 1, 1],
      u_shininess: 50,
      u_specularFactor: 1,
      u_view: m4.identity(),
      u_projection: m4.identity(),
    };

    this.styleUniforms = {
      u_colorMult: [1, 1, 1, 1],
    };

    this.objectUniforms = {
      u_world: m4.identity(),
    };

    this.primatives = {
      box: this.createCube(),
      ball: this.createBall(),
      rect: this.createRect(),
    };

    this.screenBufferInfo = primitives.createXYQuadBufferInfo(this.gl, 2);

    this.framebuffersPingPong = [
      this.createStandardFramebuffer(),
      this.createStandardFramebuffer(),
    ];

    this.currentFramebufferPingPongIndex = 0;

    this.passes = {
      kaleidoscope: new KaleidoscopePass(this),
      grid: new GridShiftPass(this),
      px: new PxGridPass(this),
      rgb: new RGBShiftPass(this),
      convolution: new ConvolutionPass(this),
      bloom: new BloomPass(this),
      feedback: new FeedbackPass(this),
      warp: new WarpPass(this),
      ascii: new AsciiPass(this),
    };
  }

  createStandardFramebuffer() {
    return createFramebufferInfo(this.gl);
  }

  resizeStandardFramebuffer(framebuffer: FramebufferInfo) {
    return resizeFramebufferInfo(this.gl, framebuffer);
  }

  private createMainProgram(): ProgramInfo {
    return createProgramInfo(this.gl, [basicVert, basicFrag]);
  }

  private createPassThroughProgram(): ProgramInfo {
    return createProgramInfo(this.gl, [screenVert, screenFrag]);
  }

  createRect(): VertexArrayInfo {
    return createVertexArrayInfo(
      this.gl,
      this.mainProgramInfo,
      primitives.createPlaneBufferInfo(this.gl, 1, 1),
    );
  }

  createCube(): VertexArrayInfo {
    return createVertexArrayInfo(
      this.gl,
      this.mainProgramInfo,
      primitives.createCubeBufferInfo(this.gl, 1),
    );
  }

  createBall(): VertexArrayInfo {
    return createVertexArrayInfo(
      this.gl,
      this.mainProgramInfo,
      primitives.createSphereBufferInfo(this.gl, 1, 20, 20),
    );
  }

  renderVertexArrayInfo(ctx: RenderContext, vertexArrayInfo: VertexArrayInfo) {
    this.objectUniforms.u_world = ctx.world;
    setUniforms(this.mainProgramInfo, this.objectUniforms);

    setBuffersAndAttributes(this.gl, this.mainProgramInfo, vertexArrayInfo);
    drawBufferInfo(this.gl, vertexArrayInfo);
  }

  renderBox(ctx: RenderContext) {
    this.renderVertexArrayInfo(ctx, this.primatives.box);
  }

  renderBall(ctx: RenderContext) {
    this.renderVertexArrayInfo(ctx, this.primatives.ball);
  }

  update(time: number): void {
    this.time = time;
    this.frame++;
  }

  updateFFTData(fftData: Float32Array) {
    this.fftData = fftData;
  }

  updateTempoData(tempoData: TempoData) {
    this.tempoData = tempoData;
  }

  getTime(): number {
    return this.time;
  }

  getFrame(): number {
    return this.frame;
  }

  useMainProgram() {
    this.gl.enable(this.gl.BLEND);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.useProgram(this.mainProgramInfo.program);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.blendEquation(this.gl.FUNC_ADD);
  }

  getCurrentFrameBuffer(): FramebufferInfo {
    return this.framebuffersPingPong[this.currentFramebufferPingPongIndex];
  }

  getNextFrameBuffer(): FramebufferInfo {
    return this.framebuffersPingPong[
      (this.currentFramebufferPingPongIndex + 1) %
        this.framebuffersPingPong.length
    ];
  }

  advanceFrameBufferPingPong(): void {
    this.currentFramebufferPingPongIndex =
      (this.currentFramebufferPingPongIndex + 1) %
      this.framebuffersPingPong.length;
  }

  render(callback: (ctx: RenderManager) => void) {
    if (resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement)) {
      for (const framebuffer of this.framebuffersPingPong) {
        this.resizeStandardFramebuffer(framebuffer);
      }
      this.passes.bloom.resizeFramebuffers();
      this.passes.feedback.resizeFramebuffers();
    }

    bindFramebufferInfo(this.gl, this.getCurrentFrameBuffer());

    this.clear();

    this.useMainProgram();

    setUniforms(this.mainProgramInfo, this.globalUniforms);
    setUniforms(this.mainProgramInfo, this.styleUniforms);

    const manager = new RenderManager(this);

    callback(manager);

    // renders the render buffer to the canvas with antialisaing
    bindFramebufferInfo(
      this.gl,
      this.getCurrentFrameBuffer(),
      this.gl.READ_FRAMEBUFFER,
    );
    bindFramebufferInfo(this.gl, null, this.gl.DRAW_FRAMEBUFFER);
    this.clear();
    this.gl.blitFramebuffer(
      0,
      0,
      this.gl.drawingBufferWidth,
      this.gl.drawingBufferHeight,
      0,
      0,
      this.gl.drawingBufferWidth,
      this.gl.drawingBufferHeight,
      this.gl.COLOR_BUFFER_BIT,
      this.gl.LINEAR,
    );
  }

  doRenderPass<TRenderPassProps>(
    pass: RenderPass<TRenderPassProps>,
    props: TRenderPassProps,
  ) {
    const currentFramebuffer = this.getCurrentFrameBuffer();
    const nextFramebuffer = this.getNextFrameBuffer();

    if (pass.render(props, currentFramebuffer, nextFramebuffer)) {
      // only advance ping pong if render happened
      this.advanceFrameBufferPingPong();
    }
  }

  clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  processFragmentShaderProgram(
    program: ProgramInfo,
    fromFramebuffer: FramebufferInfo,
    toFramebuffer: FramebufferInfo,
  ) {
    // switch back to the render framebuffer
    bindFramebufferInfo(this.gl, toFramebuffer);

    // clear the render framebuffer
    this.clear();

    // set the color framebuffer attachment as a uniform for the shader
    setUniforms(program, {
      u_texture: fromFramebuffer.attachments[0],
    });

    // reset after the VAO drawing
    this.gl.bindVertexArray(null);

    // draw a quad for the size of the screen
    setBuffersAndAttributes(this.gl, program, this.screenBufferInfo);
    drawBufferInfo(this.gl, this.screenBufferInfo);

    // switch back to the main program
    this.useMainProgram();
  }

  blendFramebuffer(
    fromFramebuffer: FramebufferInfo,
    onFramebuffer: FramebufferInfo,
    clear = false,
  ) {
    bindFramebufferInfo(this.gl, onFramebuffer);

    if (clear) {
      this.clear();
    }

    this.gl.useProgram(this.passThroughProgramInfo.program);

    // set the color framebuffer attachment as a uniform for the shader
    setUniforms(this.passThroughProgramInfo, {
      u_texture: fromFramebuffer.attachments[0],
    });

    // reset after the VAO drawing
    this.gl.bindVertexArray(null);

    // draw a quad for the size of the screen
    setBuffersAndAttributes(
      this.gl,
      this.passThroughProgramInfo,
      this.screenBufferInfo,
    );
    drawBufferInfo(this.gl, this.screenBufferInfo);

    // switch back to the main program
    this.useMainProgram();
  }

  updateColor(color: Vec4) {
    this.styleUniforms.u_colorMult = color;
    setUniforms(this.mainProgramInfo, this.styleUniforms);
  }

  blendFunc(sfactor: number, dfactor: number) {
    this.gl.blendFunc(sfactor, dfactor);
  }
}
