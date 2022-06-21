import { m4 } from "twgl.js";
import { MatrixStack } from "./MatrixStack";
import { Renderer } from "./Renderer";
import { RenderContext } from "./types";

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
  viewProjection: m4.Mat4;
};

export class RenderManager implements RenderManagerInterface {
  private worldMatrix: MatrixStack;
  private renderer: Renderer;
  private cameraDetails: CameraMatrixes

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.worldMatrix = new MatrixStack();
    this.cameraDetails = this.setupCamera();

    this.renderer.updateUniforms({ u_viewInverse: this.cameraDetails.view })
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
    const viewProjection = m4.multiply(projection, view);

    return {
      camera,
      projection,
      view,
      viewProjection,
    };
  }

  private createRenderContext() : RenderContext {
    return {
        world: this.worldMatrix.current,
        viewProjection: this.cameraDetails.viewProjection
    }
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
