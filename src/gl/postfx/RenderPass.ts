import { createProgramInfo, ProgramInfo } from "twgl.js";
import { Renderer } from "../Renderer";

export class RenderPass {

    programInfo: ProgramInfo;

    constructor(renderer: Renderer, vertexShader: string, fragementShader: string) {
        this.programInfo = createProgramInfo(renderer.gl, [vertexShader, fragementShader]);
    }
}