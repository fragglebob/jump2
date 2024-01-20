import { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

import vertShader from "../shaders/screen.vert.glsl";
import fragShader from "../shaders/grid-shift.frag.glsl";
import { FramebufferInfo, setUniforms } from "twgl.js";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
    rows: number;
};

export class GridShiftPass extends ShaderRenderPass<Props> {
    constructor(renderer: Renderer) {
        super(renderer, vertShader, fragShader)
    }

    render(args: Props, fromFramebuffer: FramebufferInfo, toFramebuffer: FramebufferInfo) {
        const time = this.renderer.getTime();

        this.renderer.gl.useProgram(this.programInfo.program);

        setUniforms(this.programInfo, {
            u_rows: args.rows,
            u_time: time,
        })

        this.renderer.processFragmentShaderProgram(this.getProgramInfo(), fromFramebuffer, toFramebuffer);

        return true;
    }
}