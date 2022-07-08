import {
  bindFramebufferInfo,
  BufferInfo,
  createBufferInfoFromArrays,
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
import screenVert from "./shaders/screen.vert.glsl";
import screenFrag from "./shaders/screen.frag.glsl";
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
  screenProgramInfo: ProgramInfo;

  basicTexture: WebGLTexture;

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
    // u_diffuse: WebGLTexture,
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
    this.screenProgramInfo = this.createScreenProgram();

    this.basicTexture = this.createBasicTexture();

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
      // u_diffuse: this.basicTexture,
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

  private createScreenProgram(): ProgramInfo {
    return createProgramInfo(this.gl, [screenVert, screenFrag]);
  }

  private createBasicTexture(): WebGLTexture {
    return createTexture(this.gl, {
      min: this.gl.NEAREST,
      mag: this.gl.NEAREST,
      src: [
        255, 255, 255, 255, 192, 192, 192, 255, 192, 192, 192, 255, 255, 255,
        255, 255,
      ],
    });
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

    bindFramebufferInfo(this.gl, this.renderFramebuffer, this.gl.READ_FRAMEBUFFER);
    bindFramebufferInfo(this.gl, null, this.gl.DRAW_FRAMEBUFFER);
    this.clear();
    this.gl.blitFramebuffer(
      0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
      0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
      this.gl.COLOR_BUFFER_BIT, this.gl.LINEAR
    );

    // this.gl.useProgram(this.screenProgramInfo.program);
    // this.drawFramebuffer(
    //   this.screenProgramInfo,
    //   null
    // );

    // bindFramebufferInfo(this.gl, this.framebuffers[0]);
    // this.clear();
    // bindFramebufferInfo(this.gl, this.framebuffers[1]);
    // this.clear();
    // bindFramebufferInfo(this.gl, null);
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
    bindFramebufferInfo(this.gl, this.renderFramebuffer, this.gl.READ_FRAMEBUFFER);
    bindFramebufferInfo(this.gl, this.colorFramebuffer, this.gl.DRAW_FRAMEBUFFER);
    this.clear();
    this.gl.blitFramebuffer(
      0, 0, this.colorFramebuffer.width, this.colorFramebuffer.height,
      0, 0, this.colorFramebuffer.width, this.colorFramebuffer.height,
      this.gl.COLOR_BUFFER_BIT, this.gl.LINEAR
    );

    bindFramebufferInfo(this.gl, this.renderFramebuffer);

    this.clear();

    setUniforms(program, {
      u_texture: this.colorFramebuffer.attachments[0]
    });

    this.gl.bindVertexArray(null)
    
    setBuffersAndAttributes(this.gl, program, this.screenBufferInfo);
    drawBufferInfo(this.gl, this.screenBufferInfo);

    this.useMainProgram();

    // bindFramebufferInfo(this.gl, this.transferFramebuffer, this.gl.READ_FRAMEBUFFER);
    // bindFramebufferInfo(this.gl, to, this.gl.DRAW_FRAMEBUFFER);
    // this.clear();
    // this.gl.blitFramebuffer(
    //   0, 0, from.width, from.height,
    //   0, 0, from.width, from.height,
    //   this.gl.COLOR_BUFFER_BIT, this.gl.LINEAR
    // );

    // bindFramebufferInfo(this.gl, to);
  }

  updateColor(color: Vec4) {
    this.styleUniforms.u_colorMult = color;
    setUniforms(this.mainProgramInfo, this.styleUniforms);
  }

}
