import { createFunction, UserRenderFunction } from "../compiler/createFunction";
import { Renderer } from "./Renderer";

export class GLApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  readonly textarea: HTMLTextAreaElement;

  readonly renderer: Renderer;

  renderFunc: UserRenderFunction;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, textarea: HTMLTextAreaElement) {
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
      this.renderFunc = createFunction(userInputCode);
      this.textarea.classList.remove("error");
    } catch(e) {
      this.textarea.classList.add("error");
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

    this.renderer.update(time);

    this.renderer.render((manager) => {
      this.renderFunc({}, manager);
    })

    requestAnimationFrame(this._render);
  };


}
