import { Renderer } from "../Renderer";

import vertShader from "../shaders/screen.vert.glsl";
import fragShader from "../shaders/warp.frag.glsl";
import { FramebufferInfo, setUniforms } from "twgl.js";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
    size?: number;
    speed?: number;
    amount?: number;
    time?: number;
};

export class WarpPass extends ShaderRenderPass<Props> {
    constructor(renderer: Renderer) {
        super(renderer, vertShader, fragShader)
    }

    render(args: Props, fromFramebuffer: FramebufferInfo, toFramebuffer: FramebufferInfo) {
        const time = args.time ?? this.renderer.getTime();

        this.renderer.gl.useProgram(this.programInfo.program);

        setUniforms(this.programInfo, {
            u_time: time,
            u_size: args.size ?? 4,
            u_speed: args.speed ?? 0.08636722,
            u_amount: args.amount ?? 0.002
        })

        this.renderer.processFragmentShaderProgram(this.getProgramInfo(), fromFramebuffer, toFramebuffer);
    }
}