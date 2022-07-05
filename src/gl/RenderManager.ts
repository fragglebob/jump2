import { m4 } from "twgl.js";
import { MatrixStack } from "./MatrixStack";
import { Renderer } from "./Renderer";
import { RenderContext } from "./types";
import { hslToRgb } from "./utils/hsl2rgb";

interface RenderManagerInterface {
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

    const eye = [1, 0, -15];
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
}
