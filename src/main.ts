import './style.css';

import { AppMode, GLApp } from "./gl";
import { Analyser } from './audio/Analyser';

function findElementOrThrow<THTMLElement extends HTMLElement>(selector: string) : THTMLElement {
    const elemet = document.querySelector<THTMLElement>(selector);
    if (!elemet) {
        throw new Error(`Can't find "${selector}" on page. :(`);
    }
    return elemet;
}

function findCanvas(): HTMLCanvasElement {
    return findElementOrThrow<HTMLCanvasElement>("#canvas");
}

function createWebGLContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    const gl = canvas.getContext("webgl2", { antialias: false });
    if (!gl) {
        throw new Error("Can't start webgl 2context. :(");
    }
    return gl;
}

async function getUserMedia(constraits: MediaStreamConstraints): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia(constraits);
}

function setupUserAudio() : Promise<Analyser> {
    return new Promise((resolve) => {
        const audioSelector =  findElementOrThrow<HTMLSelectElement>("#audio-input-select");

        audioSelector.addEventListener("click", handleAudioStart);
    
        async function handleAudioStart() {
    
            audioSelector.removeEventListener("click", handleAudioStart);
    
            let stream: MediaStream | null = null;
            let inputDevices;
    
            const audioAnalyser = await Analyser.make();
    
            try {
                stream = await getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false,
                    }
                });
                inputDevices = await navigator.mediaDevices.enumerateDevices()
                    .then(devices => devices.filter(device => device.kind === "audioinput"));
                    
                audioSelector.replaceChildren(...inputDevices.map((device, i): HTMLOptionElement => {
                    const option = document.createElement("option");
                    option.value = device.deviceId;
                    option.textContent = device.label;
                    option.selected = i === 0;
                    return option;
                }));
    
                audioSelector.addEventListener("change", async () => {
                    stream = await getUserMedia({ audio: {
                        deviceId: audioSelector.value,
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false,
                    }});
                    audioAnalyser.setInputStream(stream);
                });
    
                audioAnalyser.setInputStream(stream);

                resolve(audioAnalyser);
            } catch (err) {
                console.error(err);
            }
        }
    });
}

function getAppMode(): AppMode {

    if (window.location.pathname.startsWith("/editor")) {
        return "editor";
    }
    if(window.location.pathname.startsWith("/demo")) {
        return "demo";
    }

    return "normal";
}

async function start() {
    let canvas: HTMLCanvasElement | undefined;
    let gl: WebGL2RenderingContext | undefined;

    const codeRoot = findElementOrThrow<HTMLDivElement>("#code");


    const mode = getAppMode();

    let glapp = new GLApp(mode, codeRoot);

    let analyser: Analyser;

    if(mode !== "editor") {
        canvas = findCanvas();
        gl = createWebGLContext(canvas);
        glapp.setupRenderer(canvas, gl);
    } else {
        document.body.classList.add("editor");
    }

    if (mode === "demo") {
        document.body.classList.add("demo");
    }

    glapp.start();

    setupUserAudio().then(instance => {
        analyser = instance;
        glapp.setAudioAnalyser(analyser);
    });

    if (import.meta.hot) {
        import.meta.hot.accept('./gl/index.ts', (newGLModule) => {
            if(newGLModule) {
                glapp.stop();
                // the callback receives the updated './foo.js' module
                glapp = new newGLModule.GLApp(mode, codeRoot);
                if(analyser) {
                    glapp.setAudioAnalyser(analyser);
                }
                if(canvas && gl) {
                    glapp.setupRenderer(canvas, gl);
                }
                glapp.start();
            }
        })
    }
}

start().catch(err => console.error(err))