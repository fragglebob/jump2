import { Analyser } from "../audio/Analyser";
import { createFunction, UserRenderFunction } from "../compiler/createFunction";
import { Renderer } from "./Renderer";
import {startingCode} from "../demo-code";


const localStorageKey = 'JUMP2_SCRIPT'

export class GLApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  readonly textarea: HTMLTextAreaElement;

  readonly renderer: Renderer;

  audioAnalyser?: Analyser;

  animationFrame?: number;

  renderFunc: UserRenderFunction;

  renderFuncState: object;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, textarea: HTMLTextAreaElement) {
    this.canvas = canvas;
    this.gl = gl;
    this.textarea = textarea;

    this.renderer = new Renderer(gl);

    // set to a noop function
    this.renderFunc = () => {};

    // set state to an empty state
    this.renderFuncState = {}
  }

  compileTextarea() {
    const userInputCode = this.textarea.value;
    try {
      this.renderFunc = createFunction(userInputCode);
    } catch(e) {
      this.textarea.classList.add("error");
      return;
    }

    this.textarea.classList.remove("error");
    this.updateLocalStorageWithCode(userInputCode);
  }

  updateLocalStorageWithCode(code: string) {
    try {
      window.localStorage.setItem(localStorageKey, code)
    } catch (e) {
      console.error('Failed to save code to local storage', e);
    }
  }

  getStartingCode(): string {
    try {
      return window.localStorage.getItem(localStorageKey) ?? startingCode;
    } catch (e) {
      console.error('Failed to fetch code from locale storage', e);
      return startingCode;
    }
  }

  handleTextareaUpdate = () => {
    this.compileTextarea();
  }

  initializeTextarea = () => {
    this.textarea.value = this.getStartingCode();
    this.compileTextarea();
    this.textarea.addEventListener("input", this.handleTextareaUpdate)
  }

  start() {
    this.initializeTextarea();
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
      this.renderer.updateTempoData(this.audioAnalyser.updateBeat());
    }

    this.renderer.render((manager) => {
      this.renderFunc(this.renderFuncState, manager);
    })

    this.animationFrame = requestAnimationFrame(this._render);
  };


}
