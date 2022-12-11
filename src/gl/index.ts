import { Analyser } from "../audio/Analyser";
import { createFunction, UserRenderFunction } from "../compiler/createFunction";
import { Renderer } from "./Renderer";
import * as monaco from "monaco-editor"
import { createParser } from "../parser/parser";

export class GLApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  readonly editor: monaco.editor.IStandaloneCodeEditor;

  readonly renderer: Renderer;

  audioAnalyser?: Analyser;

  animationFrame?: number;

  renderFunc: UserRenderFunction;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, editor: monaco.editor.IStandaloneCodeEditor) {
    this.canvas = canvas;
    this.gl = gl;
    this.editor = editor;

    this.renderer = new Renderer(gl);

    // set to a noop function
    this.renderFunc = () => {};
  }

  compileTextarea() {
    const userInputCode = this.editor.getValue();
    const model = this.editor.getModel()!;

    const parser = createParser();
    
    try {
      this.renderFunc = createFunction(parser, userInputCode);
      monaco.editor.setModelMarkers(model, 'owner', []);
    } catch(e: any) {

      const table: any[] = parser.table;

      const lastColumnIndex = parser.table.length - 3;
      const lastColumn = parser.table[lastColumnIndex];

      const lineNumber = lastColumn.lexerState.line;

      const colStart = model.getLineFirstNonWhitespaceColumn(lineNumber);
      const colEnd = model.getLineLastNonWhitespaceColumn(lineNumber);

      monaco.editor.setModelMarkers(model, 'owner', [{
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        startColumn: colStart,
        endColumn: colEnd,
        message: "ERRRRR",
        severity: monaco.MarkerSeverity.Error
      }])
  
    }
  }

  handleTextareaUpdate = () => {
    this.compileTextarea();
  }

  start() {
    this.compileTextarea();
    this.editor.getModel()?.onDidChangeContent(this.handleTextareaUpdate)
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
