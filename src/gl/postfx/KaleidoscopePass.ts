import { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

import vertShader from "../shaders/screen.vert.glsl";
import fragShader from "../shaders/kaleidoscope.frag.glsl";
import { setUniforms } from "twgl.js";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
    segments: number;
};

export class KaleidoscopePass extends ShaderRenderPass<Props> {
    constructor(renderer: Renderer) {
        super(renderer, vertShader, fragShader)
    }

    render(args: Props) {
        const segments = args.segments;
        const time = this.renderer.getTime();

        this.renderer.gl.useProgram(this.programInfo.program);

        setUniforms(this.programInfo, {
            u_offset: 0,
            u_divisor: (Math.PI * 2) / Math.max(segments, 1),
            u_roll: time / 10,
            u_time: time,
        })

        this.renderer.renderShaderRenderPass(this);
    }
}