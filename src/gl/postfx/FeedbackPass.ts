import type { FramebufferInfo } from "twgl.js";
import type { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

export type Props = object;

export class FeedbackPass extends RenderPass<Props> {
	feedbackFrameBuffer: FramebufferInfo;
	stagingFrameBuffer: FramebufferInfo;

	constructor(renderer: Renderer) {
		super(renderer);

		this.feedbackFrameBuffer = this.renderer.createStandardFramebuffer();

		this.stagingFrameBuffer = this.renderer.createStandardFramebuffer();
	}

	render(
		args: Props,
		fromFramebuffer: FramebufferInfo,
		toFramebuffer: FramebufferInfo,
	) {
		this.renderer.blendFramebuffer(
			this.feedbackFrameBuffer,
			toFramebuffer,
			true,
		);
		this.renderer.blendFramebuffer(fromFramebuffer, toFramebuffer, false);

		this.renderer.blendFunc(
			this.renderer.gl.ONE,
			this.renderer.gl.ONE_MINUS_SRC_ALPHA,
		);
		this.renderer.blendFramebuffer(
			fromFramebuffer,
			this.feedbackFrameBuffer,
			false,
		);

		return true;
	}

	resizeFramebuffers() {
		this.renderer.resizeStandardFramebuffer(this.feedbackFrameBuffer);
		this.renderer.resizeStandardFramebuffer(this.stagingFrameBuffer);
	}
}
