import { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

import vertShader from "../shaders/screen.vert.glsl";
import fragShader from "../shaders/px-grid.frag.glsl";
import { FramebufferInfo, setUniforms } from "twgl.js";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
    x: number;
    y: number;
};

export class PxGridPass extends ShaderRenderPass<Props> {
    constructor(renderer: Renderer) {
        super(renderer, vertShader, fragShader)
    }

    render(args: Props, fromFramebuffer: FramebufferInfo, toFramebuffer: FramebufferInfo) {
        const time = this.renderer.getTime();

        this.renderer.gl.useProgram(this.programInfo.program);

        setUniforms(this.programInfo, {
            u_x: args.x,
            u_y: args.y
        })

        this.renderer.processFragmentShaderProgram(this.getProgramInfo(), fromFramebuffer, toFramebuffer);
    }
}