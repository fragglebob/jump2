import { m4 } from "twgl.js";
import { MatrixStack } from "./MatrixStack";
import { Renderer } from "./Renderer";
import { RenderContext } from "./types";
import { hslToRgb } from "./utils/hsl2rgb";

interface RenderManagerInterface {

  time(): number;
  frame(): number;

  beat(): number;
  bar(): number;

  fft(index: number): number;

  pushMatrix(): void;
  popMatrix(): void;

  translate(x: number, y: number, z: number): void;

  rotateX(amount: number): void;
  rotateY(amount: number): void;
  rotateZ(amount: number): void;

  scale(amount: number): void;
  scale(x: number, y: number, z: number): void;

  box(): void;
  ball(): void;

  rgb(r: number, g: number, b: number): void;
  rgba(r: number, g: number, b: number, a: number): void;
  hsl(h: number, s: number, l: number): void;
  hsla(h: number, s: number, l: number, a: number): void;

  fx_kale(segments: number): void;
  fx_grid(rows: number): void;
  fx_px(x: number, y?: number): void;
  fx_rgb(amount: number, angle?: number): void;
  fx_bloom(): void;
  fx_feedback(): void;
  fx_warp(size?: number, speed?: number, amount?: number): void;
}

type CameraMatrixes = {
  camera: m4.Mat4;
  projection: m4.Mat4;
  view: m4.Mat4;
};

export class RenderManager implements RenderManagerInterface {
  private worldMatrix: MatrixStack;
  private renderer: Renderer;
  private cameraDetails: CameraMatrixes

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.worldMatrix = new MatrixStack();
    this.cameraDetails = this.setupCamera();

    this.renderer.globalUniforms.u_view = this.cameraDetails.view;
    this.renderer.globalUniforms.u_projection = this.cameraDetails.projection;
  }

  private setupCamera() : CameraMatrixes {
    const fov = (30 * Math.PI) / 180;
    const aspect =
      this.renderer.gl.canvas.clientWidth /
      this.renderer.gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 100;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    const eye = [0, 0, -15];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);

    const view = m4.inverse(camera);

    return {
      camera,
      projection,
      view,
    };
  }

  private createRenderContext() : RenderContext {
    return {
        world: this.worldMatrix.current
    }
  }

  time() {
    return this.renderer.getTime();
  }

  frame() {
    return this.renderer.getFrame();
  }

  beat() : number {
    return this.renderer.tempoData?.currentBeat ?? 0;
  }

  bar() : number {
    return this.renderer.tempoData?.currentBeat ?? 0;
  }

  fft(index: number = 0) : number {
    if(!this.renderer.fftData || typeof this.renderer.fftData[index] === "undefined") {
      return 0;
    }
    return this.renderer.fftData[index];
  }

  rgb(r: number, g: number, b: number) {
    this.rgba(r, g, b, 1);
  }

  rgba(r: number, g: number, b: number, a: number) {
    this.renderer.updateColor([r, g, b, a]);
  }

  hsl(h: number, s: number, l: number) {
    const [r, g, b] = hslToRgb(h, s, l);
    this.rgba(r, g, b, 1);
  }

  hsla(h: number, s: number, l: number, a: number) {
    const [r, g, b] = hslToRgb(h, s, l);
    this.rgba(r, g, b, a);
  }

  pushMatrix() {
    this.worldMatrix.push();
  }

  popMatrix() {
    this.worldMatrix.pop();
  }

  box() {
    this.renderer.renderBox(this.createRenderContext());
  }

  ball() {
    this.renderer.renderBall(this.createRenderContext());
  }

  translate(x: number, y: number, z: number) {
    this.worldMatrix.translate([x, y, z]);
  }

  rotateX(amount: number) {
    this.worldMatrix.rotateX(amount);
  }
  rotateY(amount: number) {
    this.worldMatrix.rotateY(amount);
  }
  rotateZ(amount: number) {
    this.worldMatrix.rotateZ(amount);
  }

  scale(x: number, y?: number, z?: number) {
    if (y != null && z != null) {
      this.worldMatrix.scale([x, y, z]);
    } else {
      this.worldMatrix.scale([x, x, x]);
    }
  }

  fx_kale(segments?: number, time?: number) {
    this.renderer.doRenderPass(
      this.renderer.passes.kaleidoscope,
      { segments: segments ?? 2, time }
    );
  }

  fx_grid(rows: number) {
    this.renderer.doRenderPass(
      this.renderer.passes.grid,
      { rows: rows ?? 2 }
    );
  }

  fx_px(x: number, y?: number) {
    this.renderer.doRenderPass(
        this.renderer.passes.px,
        { x: x ?? 100, y: y ?? x ?? 100 }
    );
  }

  fx_rgb(amount: number, angle?: number) {
    this.renderer.doRenderPass(
      this.renderer.passes.rgb,
      { amount: amount ?? 0.01, angle }
    );
  }

  fx_bloom() {
    this.renderer.doRenderPass(
      this.renderer.passes.bloom,
      {}
    );
  }

  fx_feedback() {
    this.renderer.doRenderPass(
      this.renderer.passes.feedback,
      {}
    );
  }

  fx_warp(size?: number, speed?: number, amount?: number) {
    this.renderer.doRenderPass(
      this.renderer.passes.warp,
      { size, speed, amount }
    );
  }
}
