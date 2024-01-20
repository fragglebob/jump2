import { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

import vertShader from "../shaders/screen.vert.glsl";
import fragShader from "../shaders/rgb-shift.frag.glsl";
import { FramebufferInfo, setUniforms } from "twgl.js";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
    amount: number;
    angle?: number;
};

export class RGBShiftPass extends ShaderRenderPass<Props> {
    constructor(renderer: Renderer) {
        super(renderer, vertShader, fragShader)
    }

    render(args: Props, fromFramebuffer: FramebufferInfo, toFramebuffer: FramebufferInfo) {

        this.renderer.gl.useProgram(this.programInfo.program);

        setUniforms(this.programInfo, {
            u_angle: args.angle || 0,
            u_amount: args.amount,
        });

        this.renderer.processFragmentShaderProgram(this.getProgramInfo(), fromFramebuffer, toFramebuffer);

        return true;
    }
}