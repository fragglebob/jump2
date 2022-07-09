import { FramebufferInfo } from "twgl.js";
import { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

export type Props = {};

export class FeedbackPass extends RenderPass<Props> {

    feedbackFrameBuffer: FramebufferInfo;
    stagingFrameBuffer: FramebufferInfo;

    constructor(renderer: Renderer) {
        super(renderer);

        this.feedbackFrameBuffer = this.renderer.createMultiSampledFramebuffer();

        this.stagingFrameBuffer = this.renderer.createMultiSampledFramebuffer();

    }

    render(args: Props) {

        // this.renderer.blendFunc(this.renderer.gl.ONE, this.renderer.gl.ONE_MINUS_SRC_ALPHA);
        this.renderer.blendFramebuffer(this.feedbackFrameBuffer, this.stagingFrameBuffer, true);

        // this.renderer.blendFunc(this.renderer.gl.ONE, this.renderer.gl.ONE_MINUS_SRC_ALPHA);
        this.renderer.blendFramebuffer(this.renderer.renderFramebuffer, this.stagingFrameBuffer, false);
   
        this.renderer.blendFunc(this.renderer.gl.ONE, this.renderer.gl.ONE_MINUS_SRC_ALPHA);
        this.renderer.blendFramebuffer(this.renderer.renderFramebuffer, this.feedbackFrameBuffer, false);
    
        // this.renderer.blendFunc(this.renderer.gl.ONE, this.renderer.gl.ONE_MINUS_SRC_ALPHA);
        this.renderer.blendFramebuffer(this.stagingFrameBuffer, this.renderer.renderFramebuffer, true);
    }

    resizeFramebuffers() {
        this.renderer.resizeMultiSampledFramebuffer(this.feedbackFrameBuffer);
        this.renderer.resizeMultiSampledFramebuffer(this.stagingFrameBuffer);
    }
}