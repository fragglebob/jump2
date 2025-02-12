import type { Analyser } from "../audio/Analyser";
import {
  type UserRenderFunction,
  createFunction,
} from "../compiler/createFunction";
import type { MIDIMix } from "../midi/MIDIMix";
import { Renderer } from "./Renderer";
import {
  type CursorSelection,
  getCursorSelection,
  isCursorSelection,
} from "./utils/getCursorSelection";
import { getStartingCode } from "./utils/getStartingCode";
import { codeStorageKey, updateCodeInLocalStorage } from "./utils/localStorage";

export type AppMode = "editor" | "demo" | "normal";

interface CodeDisplay {
  setIsError(isError: boolean): void;
  setSelection(selection: CursorSelection): void;
  init(): void;
  destory(): void;
  displayCode(code: string): void;
}

class TextareaCodeDisplay implements CodeDisplay {
  readonly textarea: HTMLTextAreaElement;

  app: GLApp;

  constructor(app: GLApp) {
    this.app = app;
    this.textarea = document.createElement("textarea");
  }

  setIsError(isError: boolean): void {
    if (isError) {
      this.textarea.classList.add("error");
    } else {
      this.textarea.classList.remove("error");
    }
  }

  handleTextareaUpdate = () => {
    const code = this.textarea.value;
    this.app.updateCode(code);
    this.sendSelectionUpdate();
  };

  displayCode(code: string) {
    this.textarea.value = code;
  }

  sendSelectionUpdate() {
    const selection = getCursorSelection(this.textarea);
    if (selection) {
      this.app.updateSelection(selection);
    }
  }

  handleTextareaSelectionChannge = () => {
    if (!document.hasFocus()) {
      return;
    }
    this.sendSelectionUpdate();
  };

  init = () => {
    this.app.root.appendChild(this.textarea);
    this.textarea.addEventListener("input", this.handleTextareaUpdate);
    this.textarea.addEventListener(
      "selectionchange",
      this.handleTextareaSelectionChannge,
    );
  };

  destory = () => {
    this.app.root.removeChild(this.textarea);
    this.textarea.removeEventListener("input", this.handleTextareaUpdate);
    this.textarea.removeEventListener(
      "selectionchange",
      this.handleTextareaSelectionChannge,
    );
  };

  setSelection(selection: CursorSelection): void {
    this.textarea.selectionStart = selection.start;
    this.textarea.selectionEnd = selection.end;
  }
}

class DemoCodeDisplay implements CodeDisplay {
  readonly pre: HTMLPreElement;

  app: GLApp;

  code: string;

  selection?: CursorSelection;

  constructor(app: GLApp) {
    this.app = app;
    this.pre = document.createElement("pre");
    this.code = "";
  }
  setIsError(isError: boolean): void {
    if (isError) {
      this.pre.classList.add("error");
    } else {
      this.pre.classList.remove("error");
    }
  }
  setSelection(selection: CursorSelection): void {
    this.selection = selection;
    this._render();
  }
  init(): void {
    this.app.root.appendChild(this.pre);
  }
  destory(): void {
    this.app.root.removeChild(this.pre);
  }
  displayCode(code: string): void {
    this.code = code;
    this._render();
  }

  _render = () => {
    if (!this.selection) {
      this.pre.textContent = this.code;
      return;
    }

    const codeBeforeSelection = this.code.slice(0, this.selection.start);
    const codeSelected = this.code.slice(
      this.selection.start,
      this.selection.end,
    );
    const codeAfterSelection = this.code.slice(this.selection.end);

    const beforeEl = document.createElement("span");
    const selEl = document.createElement("mark");
    const afterEl = document.createElement("span");

    beforeEl.textContent = codeBeforeSelection;
    selEl.textContent = codeSelected;
    afterEl.textContent = codeAfterSelection;

    this.pre.replaceChildren(beforeEl, selEl, afterEl);
    selEl.scrollIntoView({
      block: "center",
    });
  };
}

export class GLApp {
  readonly mode: AppMode;
  readonly root: HTMLElement;

  readonly codeDisplay: CodeDisplay;

  renderer?: Renderer;

  audioAnalyser?: Analyser;

  animationFrame?: number;

  renderFunc: UserRenderFunction;

  renderFuncState: object;

  selectionBC: BroadcastChannel;

  midiMix: MIDIMix;

  constructor(mode: AppMode, root: HTMLElement, midiMix: MIDIMix) {
    this.mode = mode;
    this.root = root;

    this.midiMix = midiMix;

    if (this.mode !== "demo") {
      this.codeDisplay = new TextareaCodeDisplay(this);
    } else {
      this.codeDisplay = new DemoCodeDisplay(this);
    }

    this.selectionBC = new BroadcastChannel("jump2_textarea_selection");

    this.selectionBC.addEventListener("message", this.handleSelectionBroadcast);

    // set to a noop function
    this.renderFunc = () => {};

    // set state to an empty state
    this.renderFuncState = {};
  }

  updateCode = (code: string) => {
    this.compileCode(code);
    updateCodeInLocalStorage(code);
  };

  updateSelection = (selection: CursorSelection) => {
    this.selectionBC.postMessage(selection);
  };

  handleSelectionBroadcast = (e: MessageEvent) => {
    const { data } = e;
    if (!isCursorSelection(data)) {
      return;
    }
    this.codeDisplay.setSelection(data);
  };

  compileCode(code: string) {
    try {
      this.renderFunc = createFunction(code);
    } catch (e) {
      console.error(e);
      this.codeDisplay.setIsError(true);
      return;
    }

    this.codeDisplay.setIsError(false);
  }

  handleStorageEvent = (e: StorageEvent) => {
    if (e.storageArea !== window.localStorage) {
      return;
    }
    if (e.key !== codeStorageKey) {
      return;
    }
    const newCode = e.newValue;

    if (!newCode) {
      console.error("Where is the new code bruv?");
      return;
    }

    this.codeDisplay.displayCode(newCode);
    this.compileCode(newCode);
  };

  initializeLocalStoreageSync = () => {
    window.addEventListener("storage", this.handleStorageEvent);
  };

  setupRenderer(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.renderer = new Renderer(canvas, gl, this.midiMix);
  }

  start() {
    const code = getStartingCode();
    this.codeDisplay.init();
    this.codeDisplay.displayCode(code);
    this.compileCode(code);

    this.initializeLocalStoreageSync();

    this.animationFrame = requestAnimationFrame(this._render);
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.codeDisplay.destory();

    // clean up event listeners
    window.removeEventListener("storage", this.handleStorageEvent);
    this.selectionBC.removeEventListener(
      "message",
      this.handleSelectionBroadcast,
    );
    this.selectionBC.close();
  }

  setAudioAnalyser(audioAnalyser: Analyser) {
    this.audioAnalyser = audioAnalyser;
  }

  _render = (time: number) => {
    if (!this.renderer) {
      return;
    }

    this.renderer.update(time * 0.001);

    if (this.audioAnalyser) {
      this.renderer.updateFFTData(this.audioAnalyser.getFFTData());
      this.renderer.updateTempoData(this.audioAnalyser.updateBeat());
    }

    this.renderer.render((manager) => {
      this.renderFunc(this.renderFuncState, manager);
    });

    this.animationFrame = requestAnimationFrame(this._render);
  };
}
