import type { FramebufferInfo } from "twgl.js";
import type { Renderer } from "../Renderer";

export abstract class RenderPass<T> {
	renderer: Renderer;

	constructor(renderer: Renderer) {
		this.renderer = renderer;
	}

	abstract render(
		props: T,
		fromFramebuffer: FramebufferInfo,
		toFramebuffer: FramebufferInfo,
	): boolean;
}
