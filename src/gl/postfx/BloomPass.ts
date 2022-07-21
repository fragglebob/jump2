import { FramebufferInfo } from "twgl.js";
import { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

export type Props = {};

export class BloomPass extends RenderPass<Props> {

    frameBuffers: [
        FramebufferInfo,
        FramebufferInfo
    ]

    constructor(renderer: Renderer) {
        super(renderer);

        this.frameBuffers = [
            this.renderer.createMultiSampledFramebuffer(),
            this.renderer.createMultiSampledFramebuffer(),
        ];

    }

    render(args: Props) {
        this.renderer.passes.convolution.render(
            { imageIncrement: [0.001953125, 0] },
            this.renderer.renderFramebuffer,
            this.frameBuffers[0],
        );

        this.renderer.passes.convolution.render(
            { imageIncrement: [0, 0.001953125] },
            this.frameBuffers[0],
            this.frameBuffers[1]
        );

        this.renderer.blendFunc(this.renderer.gl.ONE, this.renderer.gl.ONE);
        this.renderer.blendFramebuffer(this.frameBuffers[1], this.renderer.renderFramebuffer)
    }

    resizeFramebuffers() {
        this.renderer.resizeMultiSampledFramebuffer(this.frameBuffers[0]);
        this.renderer.resizeMultiSampledFramebuffer(this.frameBuffers[1]);
    }
}