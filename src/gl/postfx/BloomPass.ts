import type { FramebufferInfo } from "twgl.js";
import type { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

export type Props = object;

export class BloomPass extends RenderPass<Props> {
  frameBuffers: [FramebufferInfo, FramebufferInfo];

  constructor(renderer: Renderer) {
    super(renderer);

    this.frameBuffers = [
      this.renderer.createStandardFramebuffer(),
      this.renderer.createStandardFramebuffer(),
    ];
  }

  render(
    args: Props,
    fromFramebuffer: FramebufferInfo,
    toFramebuffer: FramebufferInfo,
  ) {
    this.renderer.passes.convolution.render(
      { imageIncrement: [0.001953125, 0] },
      fromFramebuffer,
      this.frameBuffers[0],
    );

    this.renderer.passes.convolution.render(
      { imageIncrement: [0, 0.001953125] },
      this.frameBuffers[0],
      this.frameBuffers[1],
    );

    this.renderer.blendFramebuffer(fromFramebuffer, toFramebuffer, true);
    this.renderer.blendFunc(this.renderer.gl.ONE, this.renderer.gl.ONE);
    this.renderer.blendFramebuffer(this.frameBuffers[1], toFramebuffer, false);

    return true;
  }

  resizeFramebuffers() {
    this.renderer.resizeStandardFramebuffer(this.frameBuffers[0]);
    this.renderer.resizeStandardFramebuffer(this.frameBuffers[1]);
  }
}
