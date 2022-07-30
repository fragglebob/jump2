import './style.css';

import { GLApp } from "./gl";
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

function findTextarea(): HTMLTextAreaElement {
    return findElementOrThrow<HTMLTextAreaElement>("#code");
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
    
            const audioAnalyser = new Analyser();
    
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

async function start() {
    const canvas = findCanvas();
    const gl = createWebGLContext(canvas);

    const textarea = findTextarea();

    let glapp = new GLApp(canvas, gl, textarea);

    let analyser: Analyser;

    glapp.start();

    setupUserAudio().then(instance => {
        analyser = instance;
        glapp.setAudioAnalyser(analyser);
    });

    if (import.meta.hot) {
        import.meta.hot.accept('./gl/index.ts', (newGLModule) => {
          glapp.stop();
          // the callback receives the updated './foo.js' module
          glapp = new newGLModule.GLApp(canvas, gl, textarea);
          if(analyser) {
            glapp.setAudioAnalyser(analyser);
          }
          glapp.start();
        })
    }
}

start().catch(err => console.error(err))