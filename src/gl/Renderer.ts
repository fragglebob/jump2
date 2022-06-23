import {
  BufferInfo,
  createBufferInfoFromArrays,
  createProgramInfo,
  createTexture,
  m4,
  primitives,
  ProgramInfo,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
} from "twgl.js";

import basicVert from "./shaders/basic.vert.glsl";
import basicFrag from "./shaders/basic.frag.glsl";
import { RenderContext } from "./types";
import { MatrixStack } from "./MatrixStack";
import { RenderManager } from "./RenderManager";

export class Renderer {
  readonly gl: WebGLRenderingContext;

  mainProgramInfo: ProgramInfo;

  basicTexture: WebGLTexture;

  uniforms: Record<string, any>;

  primatives: {
    rect: BufferInfo,
      ball: BufferInfo,
      box: BufferInfo
  }

  frame: number = 0;
  time: number = 0;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;

    this.mainProgramInfo = this.createMainProgram();
    this.basicTexture = this.createBasicTexture();

    this.uniforms = {
      u_lightWorldPos: [1, 8, -10],
      u_lightColor: [0.8, 0.8, 0.8, 1],
      u_ambient: [0.2, 0.2, 0.2, 1],
      u_specular: [1, 1, 1, 1],
      u_shininess: 50,
      u_specularFactor: 1,
      u_diffuse: this.basicTexture,
    };

    this.primatives = {
        box: this.createCube(),
        ball: this.createBall(),
        rect: this.createRect()
    }
  }

  private createMainProgram(): ProgramInfo {
    return createProgramInfo(this.gl, [basicVert, basicFrag]);
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


  createRect(): BufferInfo {
    const arrays = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    return createBufferInfoFromArrays(this.gl, arrays);
  }

  createCube(): BufferInfo {
    return primitives.createCubeBufferInfo(this.gl, 1);
  }

  createBall() : BufferInfo {
    return primitives.createSphereBufferInfo(this.gl, 1, 10, 10);
  }


  renderBufferInfo(ctx: RenderContext, bufferInfo: BufferInfo) {
    this.uniforms.u_world = ctx.world;
    this.uniforms.u_worldInverseTranspose = m4.transpose(
      m4.inverse(ctx.world)
    );
    this.uniforms.u_worldViewProjection = m4.multiply(
        ctx.viewProjection,
        ctx.world
    );

    setUniforms(this.mainProgramInfo, this.uniforms);

    setBuffersAndAttributes(this.gl, this.mainProgramInfo, bufferInfo);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      bufferInfo.numElements,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }

  renderBox(ctx: RenderContext) {
    this.renderBufferInfo(ctx, this.primatives.box);
  }

  renderBall(ctx: RenderContext) {
    this.renderBufferInfo(ctx, this.primatives.ball);
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

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.mainProgramInfo.program);

    const manager = new RenderManager(this);

    callback(manager);
  }

  updateUniforms(updates: Record<string, any>) {
      Object.assign(this.uniforms, updates);
  }
}
