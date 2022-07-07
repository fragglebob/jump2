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

  screenBufferInfo: BufferInfo;

  framebuffers: [FramebufferInfo, FramebufferInfo];
  currentFramebuffer: number = 0;

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

    this.framebuffers = [
      createFramebufferInfo(this.gl, undefined, 1024, 1024),
      createFramebufferInfo(this.gl, undefined, 1024, 1024),
    ];
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

  render(callback: (ctx: RenderManager) => void) {

    resizeCanvasToDisplaySize(this.gl.canvas);

    bindFramebufferInfo(this.gl, this.framebuffers[this.currentFramebuffer]);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


    this.gl.useProgram(this.mainProgramInfo.program);

    setUniforms(this.mainProgramInfo, this.globalUniforms);
    setUniforms(this.mainProgramInfo, this.styleUniforms);

    const manager = new RenderManager(this);

    callback(manager);

    bindFramebufferInfo(this.gl, null);

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.screenProgramInfo.program);

    setUniforms(this.screenProgramInfo, {
      u_texture: this.framebuffers[0].attachments[0]
    });

    this.gl.bindVertexArray(null)
    
    setBuffersAndAttributes(this.gl, this.screenProgramInfo, this.screenBufferInfo);
    drawBufferInfo(this.gl, this.screenBufferInfo);

  }

  updateColor(color: Vec4) {
    this.styleUniforms.u_colorMult = color;
    setUniforms(this.mainProgramInfo, this.styleUniforms);
  }

}
