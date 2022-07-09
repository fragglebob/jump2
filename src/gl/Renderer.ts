import {
  bindFramebufferInfo,
  BufferInfo,
  createFramebufferInfo,
  createProgramInfo,
  createTexture,
  createVertexArrayInfo,
  drawBufferInfo,
  FramebufferInfo,
  m4,
  primitives,
  ProgramInfo,
  resizeCanvasToDisplaySize,
  resizeFramebufferInfo,
  setBuffersAndAttributes,
  setUniforms,
  VertexArrayInfo,
} from "twgl.js";


import basicVert from "./shaders/basic.vert.glsl";
import basicFrag from "./shaders/basic.frag.glsl";
import { RenderContext } from "./types";
import { RenderManager } from "./RenderManager";
import { KaleidoscopePass } from "./postfx/KaleidoscopePass";
import { RenderPass } from "./postfx/RenderPass";
import { GridShiftPass } from "./postfx/GridShiftPass";


type Vec4 = [number, number, number, number];
type Vec3 = [number, number, number];

export class Renderer {
  readonly gl: WebGL2RenderingContext;

  mainProgramInfo: ProgramInfo;

  globalUniforms: {
    u_lightWorldPos: Vec3,
    u_lightColor: Vec4,
    u_ambient: Vec4,
    u_specular: Vec4,
    u_shininess: number,
    u_specularFactor: number,
    u_view: m4.Mat4,
    u_projection: m4.Mat4
  };
  styleUniforms: {
    u_colorMult: Vec4
  };

  objectUniforms: {
    u_world: m4.Mat4
  };

  primatives: {
    rect: VertexArrayInfo,
    ball: VertexArrayInfo,
    box: VertexArrayInfo
  }

  frame: number = 0;
  time: number = 0;

  fftData?: Float32Array;

  passes: {
    kaleidoscope: KaleidoscopePass,
    grid: GridShiftPass,
  }

  screenBufferInfo: BufferInfo;

  renderFramebuffer: FramebufferInfo;
  colorFramebuffer: FramebufferInfo;
  currentFramebufferIndex: number = 0;

  framebufferAttachmentSetup: any[] = [];

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    this.mainProgramInfo = this.createMainProgram();

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
    }

    this.objectUniforms = {
      u_world: m4.identity(),
    };

    this.primatives = {
        box: this.createCube(),
        ball: this.createBall(),
        rect: this.createRect()
    }

    this.screenBufferInfo = primitives.createXYQuadBufferInfo(this.gl, 2);

    this.framebufferAttachmentSetup = [
      {
        format: this.gl.RGBA8,
        type: this.gl.UNSIGNED_BYTE,
        min: this.gl.LINEAR,
        wrap: this.gl.CLAMP_TO_EDGE,
        samples: this.gl.getParameter(this.gl.MAX_SAMPLES),
      },
      {
        format: this.gl.DEPTH_COMPONENT16,
        samples: this.gl.getParameter(this.gl.MAX_SAMPLES),
      }
    ];

    this.renderFramebuffer = createFramebufferInfo(this.gl, this.framebufferAttachmentSetup);
    this.colorFramebuffer = createFramebufferInfo(this.gl);

    this.passes = {
      kaleidoscope: new KaleidoscopePass(this),
      grid: new GridShiftPass(this),
    };
  }

  private createMainProgram(): ProgramInfo {
    return createProgramInfo(this.gl, [basicVert, basicFrag]);
  }

  createRect(): VertexArrayInfo {
    return createVertexArrayInfo(this.gl, this.mainProgramInfo, primitives.createPlaneBufferInfo(this.gl, 1, 1));
  }

  createCube(): VertexArrayInfo {
    return createVertexArrayInfo(this.gl, this.mainProgramInfo, primitives.createCubeBufferInfo(this.gl, 1));
  }

  createBall() : VertexArrayInfo {
    return createVertexArrayInfo(this.gl, this.mainProgramInfo, primitives.createSphereBufferInfo(this.gl, 1, 10, 10));
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

  update(time: number) : void {
    this.time = time;
    this.frame++;
  }

  updateFFTData(fftData: Float32Array) {
    this.fftData = fftData;
  }

  getTime() : number {
    return this.time;
  }

  getFrame() : number {
    return this.frame;
  }

  useMainProgram() {
    this.gl.enable(this.gl.BLEND)
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.useProgram(this.mainProgramInfo.program);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.blendEquation(this.gl.FUNC_ADD)
  }

  render(callback: (ctx: RenderManager) => void) {

    if(resizeCanvasToDisplaySize(this.gl.canvas)) {
      resizeFramebufferInfo(this.gl, this.renderFramebuffer, this.framebufferAttachmentSetup);
      resizeFramebufferInfo(this.gl, this.colorFramebuffer);      
    }

    bindFramebufferInfo(this.gl, this.renderFramebuffer);

    this.clear();

    this.useMainProgram();

    setUniforms(this.mainProgramInfo, this.globalUniforms);
    setUniforms(this.mainProgramInfo, this.styleUniforms);

    const manager = new RenderManager(this);

    callback(manager);

    // renders the render buffer to the canvas with antialisaing 
    bindFramebufferInfo(this.gl, this.renderFramebuffer, this.gl.READ_FRAMEBUFFER);
    bindFramebufferInfo(this.gl, null, this.gl.DRAW_FRAMEBUFFER);
    this.clear();
    this.gl.blitFramebuffer(
      0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
      0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
      this.gl.COLOR_BUFFER_BIT, this.gl.LINEAR
    );
  }

  renderRenderPass(pass: RenderPass<any>) {

    this.processFragmentShaderProgram(
      pass.getProgramInfo()
    );
  }

  clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  processFragmentShaderProgram(program: ProgramInfo) {
    // draw the render framebuffer into the color framebuffer
    bindFramebufferInfo(this.gl, this.renderFramebuffer, this.gl.READ_FRAMEBUFFER);
    bindFramebufferInfo(this.gl, this.colorFramebuffer, this.gl.DRAW_FRAMEBUFFER);
    // clear to make the color framebuffer empty
    this.clear();
    // blit for the antialiasing
    this.gl.blitFramebuffer(
      0, 0, this.colorFramebuffer.width, this.colorFramebuffer.height,
      0, 0, this.colorFramebuffer.width, this.colorFramebuffer.height,
      this.gl.COLOR_BUFFER_BIT, this.gl.LINEAR
    );

    // switch back to the render framebuffer
    bindFramebufferInfo(this.gl, this.renderFramebuffer);

    // clear the render framebuffer
    this.clear();

    // set the color framebuffer attachment as a uniform for the shader
    setUniforms(program, {
      u_texture: this.colorFramebuffer.attachments[0]
    });

    // reset after the VAO drawing
    this.gl.bindVertexArray(null)
    
    // draw a quad for the size of the screen
    setBuffersAndAttributes(this.gl, program, this.screenBufferInfo);
    drawBufferInfo(this.gl, this.screenBufferInfo);

    // switch back to the main program
    this.useMainProgram();
  }

  updateColor(color: Vec4) {
    this.styleUniforms.u_colorMult = color;
    setUniforms(this.mainProgramInfo, this.styleUniforms);
  }

}
