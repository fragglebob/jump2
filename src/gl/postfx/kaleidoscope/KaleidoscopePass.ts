import { Renderer } from "../../Renderer";
import { RenderPass } from "../RenderPass";

import vertShader from "./kaleidoscope.vert.glsl";
import fragShader from "./kaleidoscope.frag.glsl";

export class KaleidoscopePass extends RenderPass {
    constructor(renderer: Renderer) {
        super(renderer, vertShader, fragShader)
    }
}