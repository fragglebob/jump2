import { Analyser } from "../audio/Analyser";
import { createFunction, UserRenderFunction } from "../compiler/createFunction";
import { Renderer } from "./Renderer";
import defaultProgram from "../default-program.txt";
import { getVizCodeFromUrl, isVizUrl, pushNewVizUrl } from "./utils/routing";

export class GLApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  readonly textArea: HTMLTextAreaElement;

  readonly renderer: Renderer;

  audioAnalyser?: Analyser;

  animationFrame?: number;

  renderFunc: UserRenderFunction;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, textArea: HTMLTextAreaElement) {
    this.canvas = canvas;
    this.gl = gl;
    this.textArea = textArea;

    this.renderer = new Renderer(gl);

    // set to a noop function
    this.renderFunc = () => {};
  }

  initilizeTextArea() {
    if(this.textArea.value.length === 0) {
      if(isVizUrl()) {
        try {
          this.textArea.value = getVizCodeFromUrl();
        } catch(e) {
          this.textArea.value = defaultProgram;
          this.updateUrl();
        }
      } else {
        this.textArea.value = defaultProgram;
      }
    }
    this.compileTextArea();
  }

  compileTextArea() {
    const userInputCode = this.textArea.value;
    try {
      this.renderFunc = createFunction(userInputCode);
      this.textArea.classList.remove("error");
    } catch(e) {
      this.textArea.classList.add("error");
      throw new Error("Failed to compile code to function");
    }
  }

  updateUrl() {
    try {
      pushNewVizUrl(this.textArea.value);
    } catch(e) {
      console.error("error updating viz url");
    }
  }

  handleTextAreaUpdate = () => {
    this.compileTextArea();
    this.updateUrl();
  }

  start() {
    this.initilizeTextArea();
    this.textArea.addEventListener("input", this.handleTextAreaUpdate)
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
