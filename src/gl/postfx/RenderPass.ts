import { createProgramInfo, ProgramInfo, setUniforms } from "twgl.js";
import { Renderer } from "../Renderer";

export abstract class RenderPass<T> {

    programInfo: ProgramInfo;
    renderer: Renderer;

    constructor(renderer: Renderer, vertexShader: string, fragementShader: string) {
        this.renderer = renderer;
        this.programInfo = createProgramInfo(renderer.gl, [vertexShader, fragementShader]);
    }

    getProgramInfo() {
        return this.programInfo;
    }

    abstract render(props: T) : void;
}