import * as twgl from "twgl.js";

export class Renderer {

    readonly canvas: HTMLCanvasElement;
    readonly gl: WebGLRenderingContext;

    mainProgramInfo: twgl.ProgramInfo;
    rectBufferInfo: twgl.BufferInfo;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
        this.canvas = canvas;
        this.gl = gl;

        this.mainProgramInfo = this.createMainProgram();
        this.rectBufferInfo = this.createRect();
    }

    createMainProgram(): twgl.ProgramInfo {
        return twgl.createProgramInfo(this.gl, ["vs", "fs"]);
    }

    createRect() : twgl.BufferInfo {
        const arrays = {
          position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
        };
        return twgl.createBufferInfoFromArrays(this.gl, arrays);
    }

    start() {
        requestAnimationFrame(this._render);
    }

    _render = (time: number) => {

        twgl.resizeCanvasToDisplaySize(this.gl.canvas);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    
        const uniforms = {
          time: time * 0.001,
          resolution: [this.canvas.width, this.canvas.height],
        };
    
        this.gl.useProgram(this.mainProgramInfo.program);
        twgl.setBuffersAndAttributes(this.gl, this.mainProgramInfo, this.rectBufferInfo);
        twgl.setUniforms(this.mainProgramInfo, uniforms);
        twgl.drawBufferInfo(this.gl, this.rectBufferInfo);

        requestAnimationFrame(this._render);
    }

} 