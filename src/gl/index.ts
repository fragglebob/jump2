

import { createFunction, UserRenderFunction } from "../compiler/createFunction";
import { Renderer } from "./Renderer";



export class GLApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;
  readonly textarea: HTMLTextAreaElement;

  readonly renderer: Renderer;

  renderFunc: UserRenderFunction;

  constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, textarea: HTMLTextAreaElement) {
    this.canvas = canvas;
    this.gl = gl;
    this.textarea = textarea;

    this.renderer = new Renderer(gl);

    // set to a noop function
    this.renderFunc = () => {};
  }

  compileTextarea() {
    const userInputCode = this.textarea.value;
    try {
      this.renderFunc = createFunction(userInputCode)
      this.textarea.style.border = "";
      console.log(this.renderFunc)
    } catch(e) {
      this.textarea.style.border = "2px red solid";
      console.error(e);
    }
  }

  handleTextareaUpdate = () => {
    this.compileTextarea();
  }

  start() {
    this.compileTextarea();
    this.textarea.addEventListener("input", this.handleTextareaUpdate)
    requestAnimationFrame(this._render);
  }

  _render = (time: number) => {

    time *= 0.001;


    this.renderer.render((manager) => {


      this.renderFunc({}, manager);

      manager.pushMatrix();

      for (let ii = 0; ii < 100; ii++) {
        manager.pushMatrix();
        
        manager.translate(Math.cos(time/2+ii/2+ii)*5, Math.sin(time*2+ii/2)*2, Math.sin(time+ii/3+55)*10);
        manager.rotateX(time-ii);
        manager.rotateY(time+ii);
        manager.scale((2-Math.sin(time+ii/3+55)+1)/4, (2-Math.sin(time+ii/3+55)+1)/4, (2-Math.sin(time+ii/3+55)+1)/4)

        if(ii % 2) {
          manager.box();
        } else {
          manager.ball();
        }
        

        manager.popMatrix();
      }    

      manager.popMatrix();

    })

    requestAnimationFrame(this._render);
  };


}
