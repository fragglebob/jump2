import './style.css';

import { GLApp } from "./gl";

function findCanvas() : HTMLCanvasElement {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
    if(!canvas) {
        throw new Error("Can't find #canvas on page. :(");
    }
    return canvas;
}

function createWebGLContext(canvas: HTMLCanvasElement) : WebGLRenderingContext {
    const gl = canvas.getContext("webgl");
    if(!gl) {
        throw new Error("Can't start webgl context. :(");
    }
    return gl;
}

function start () {
    const canvas = findCanvas();
    const gl = createWebGLContext(canvas);

    const render = new GLApp(canvas, gl);

    render.start();
}

start();