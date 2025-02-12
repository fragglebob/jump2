import type { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

import { type FramebufferInfo, setUniforms } from "twgl.js";
import fragShader from "../shaders/conv.frag.glsl";
import vertShader from "../shaders/conv.vert.glsl";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
	imageIncrement: [number, number];
};

export class ConvolutionPass extends ShaderRenderPass<Props> {
	constructor(renderer: Renderer) {
		super(renderer, vertShader, fragShader);
	}

	render(
		args: Props,
		fromFramebuffer: FramebufferInfo,
		toFramebuffer: FramebufferInfo,
	) {
		this.renderer.gl.useProgram(this.programInfo.program);

		setUniforms(this.programInfo, {
			u_imageIncrement: args.imageIncrement,
			u_resolution: [1, 1],
		});

		this.renderer.processFragmentShaderProgram(
			this.getProgramInfo(),
			fromFramebuffer,
			toFramebuffer,
		);

		return true;
	}
}
