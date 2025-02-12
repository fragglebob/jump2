import type { Renderer } from "../Renderer";

import { type FramebufferInfo, setUniforms } from "twgl.js";
import fragShader from "../shaders/px-grid.frag.glsl";
import vertShader from "../shaders/screen.vert.glsl";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
	x: number;
	y: number;
};

export class PxGridPass extends ShaderRenderPass<Props> {
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
			u_x: args.x,
			u_y: args.y,
		});

		this.renderer.processFragmentShaderProgram(
			this.getProgramInfo(),
			fromFramebuffer,
			toFramebuffer,
		);

		return true;
	}
}
