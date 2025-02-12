import {
	type FramebufferInfo,
	type ProgramInfo,
	createProgramInfo,
} from "twgl.js";
import type { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

export abstract class ShaderRenderPass<T> extends RenderPass<T> {
	programInfo: ProgramInfo;

	constructor(
		renderer: Renderer,
		vertexShader: string,
		fragementShader: string,
	) {
		super(renderer);
		this.programInfo = createProgramInfo(renderer.gl, [
			vertexShader,
			fragementShader,
		]);
	}

	getProgramInfo() {
		return this.programInfo;
	}

	abstract render(
		props: T,
		fromFramebuffer: FramebufferInfo,
		toFramebuffer: FramebufferInfo,
	): boolean;
}
