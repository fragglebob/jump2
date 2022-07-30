import { Renderer } from "../Renderer";
import { RenderPass } from "./RenderPass";

import vertShader from "../shaders/conv.vert.glsl";
import fragShader from "../shaders/conv.frag.glsl";
import { FramebufferInfo, setUniforms } from "twgl.js";
import { ShaderRenderPass } from "./ShaderRenderPass";

export type Props = {
    imageIncrement: [number, number];
};

export class ConvolutionPass extends ShaderRenderPass<Props> {
    constructor(renderer: Renderer) {
        super(renderer, vertShader, fragShader)
    }

    render(args: Props, fromFramebuffer: FramebufferInfo, toFramebuffer: FramebufferInfo) {
        this.renderer.gl.useProgram(this.programInfo.program);

        setUniforms(this.programInfo, {
            u_imageIncrement: args.imageIncrement,
            u_resolution: [1, 1],
        });

        this.renderer.processFragmentShaderProgram(this.getProgramInfo(), fromFramebuffer, toFramebuffer);
    }
}