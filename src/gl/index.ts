import { Analyser } from "../audio/Analyser";
import { createFunction, UserRenderFunction } from "../compiler/createFunction";
import { Renderer } from "./Renderer";

export class GLApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  readonly textarea: HTMLTextAreaElement;

  readonly renderer: Renderer;

  audioAnalyser?: Analyser;

  animationFrame?: number;

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
    this.animationFrame = requestAnimationFrame(this._render);
  }

  stop() {
    if(this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  setAudioAnalyser(audioAnalyser: Analyser) {
    this.audioAnalyser = audioAnalyser;
  }

  _render = (time: number) => {

    time *= 0.001;

    this.renderer.update(time);

    if(this.audioAnalyser) {
      this.renderer.updateFFTData(this.audioAnalyser.getFFTData());
    }

    this.renderer.render((manager) => {
      this.renderFunc({}, manager);
    })

    this.animationFrame = requestAnimationFrame(this._render);
  };


}
