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
import { KaleidoscopePass } from "./postfx/kaleidoscope/KaleidoscopePass";
import { RenderPass } from "./postfx/RenderPass";


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
  }

  screenBufferInfo: BufferInfo;

  framebuffers: [FramebufferInfo, FramebufferInfo];
  currentFramebufferIndex: number = 0;

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

    const attachments = [
      {
        format: this.gl.RGBA,
        type: this.gl.UNSIGNED_BYTE,
        min: this.gl.LINEAR,
        wrap: this.gl.CLAMP_TO_EDGE
      }, {
        format: this.gl.DEPTH_STENCIL
      }
    ]

    this.framebuffers = [
      createFramebufferInfo(this.gl, attachments),
      createFramebufferInfo(this.gl, attachments),
    ];

    this.passes = {
      kaleidoscope: new KaleidoscopePass(this),
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
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.useProgram(this.mainProgramInfo.program);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  }

  render(callback: (ctx: RenderManager) => void) {

    if(resizeCanvasToDisplaySize(this.gl.canvas)) {
      resizeFramebufferInfo(this.gl, this.framebuffers[0]);
      resizeFramebufferInfo(this.gl, this.framebuffers[1]);
    }

    bindFramebufferInfo(this.gl, this.currentFramebuffer());

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.useMainProgram();

    setUniforms(this.mainProgramInfo, this.globalUniforms);
    setUniforms(this.mainProgramInfo, this.styleUniforms);

    const manager = new RenderManager(this);

    callback(manager);

    this.gl.useProgram(this.screenProgramInfo.program);
    this.drawFramebuffer(
      this.screenProgramInfo,
      this.currentFramebuffer(),
      null
    )
  }

  renderRenderPass(pass: RenderPass<any>) {
    const currentFramebuffer = this.currentFramebuffer();
    const nextFramebuffer = this.nextFramebuffer();

    this.drawFramebuffer(
      pass.getProgramInfo(),
      currentFramebuffer,
      nextFramebuffer
    );
  }

  currentFramebuffer() : FramebufferInfo {
    return this.framebuffers[this.currentFramebufferIndex];;
  }

  nextFramebuffer() : FramebufferInfo {
    this.currentFramebufferIndex++;
    if(this.currentFramebufferIndex >= this.framebuffers.length) {
      this.currentFramebufferIndex = 0;
    }
    return this.framebuffers[this.currentFramebufferIndex];
  }

  drawFramebuffer(program: ProgramInfo, from: FramebufferInfo, to: FramebufferInfo | null) {
    bindFramebufferInfo(this.gl, to);

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    setUniforms(program, {
      u_texture: from.attachments[0]
    });

    this.gl.bindVertexArray(null)
    
    setBuffersAndAttributes(this.gl, program, this.screenBufferInfo);
    drawBufferInfo(this.gl, this.screenBufferInfo);
  }

  updateColor(color: Vec4) {
    this.styleUniforms.u_colorMult = color;
    setUniforms(this.mainProgramInfo, this.styleUniforms);
  }

}
