import { type BeatData } from "./BeatDetectorProcessor";
import BeatDetectorProcessorWorkletURL from "./BeatDetectorProcessor.ts?worker&url"

export interface TempoData {
    currentBar: number;
    currentBeat: number;
    beatProgress: number;
    barProgress:number;
}

export class Analyser {

    private ctx: AudioContext;

    private analyserNode: AnalyserNode;
    private gainNode: GainNode;

    private sourceNode?: MediaStreamAudioSourceNode;

    private fftData: Float32Array;

    private constructor(ctx: AudioContext) {
        this.ctx = ctx;

        const testNode = new AudioWorkletNode(this.ctx, "beat-detector");

        this.analyserNode = this.setupAnalyserNode();
        this.gainNode = this.setupGainNode();

        this.analyserNode.connect(testNode);
        testNode.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);

        this.fftData = new Float32Array(this.analyserNode.frequencyBinCount);

        testNode.port.onmessage = (message: MessageEvent<BeatData>) => {
            this.handleBeat(message.data);
        }
    }

    static async make(): Promise<Analyser> {
        const ctx = new AudioContext();
        await ctx.audioWorklet.addModule(BeatDetectorProcessorWorkletURL);
        return new Analyser(ctx);
    }

    private setupGainNode() : GainNode {
        const gainNode = this.ctx.createGain();
        gainNode.gain.value = 0;
        return gainNode;
    }

    private setupAnalyserNode() : AnalyserNode {
        const analyserNode = this.ctx.createAnalyser();
        analyserNode.fftSize = 64;
        // analyserNode.minDecibels = -90;
        // analyserNode.maxDecibels = -10;
        // analyserNode.smoothingTimeConstant = 0.9;
        return analyserNode;
    }

    private tempoSetTime: number = Date.now();
    private tempo: number = 120;
    private beatsCounted: number = 0;

    private currentBar: number = 0;
    private currentBeat: number = 0;

    private beatProgress: number = 0;
    private barProgress: number = 0;

    private handleBeat(beat: BeatData) {
        this.tempoSetTime = beat.timestamp / 1000;
        this.tempo = beat.bpm;
        this.beatsCounted++;
        this.updateBeat()
    }

    updateBeat() : TempoData {
        const now = Date.now() / 1000;
        const secondsPerBeat = 60 / this.tempo;

        const timeSinceTempoWasSet = now - this.tempoSetTime;

        const beatsElapsedSinceSet = timeSinceTempoWasSet / secondsPerBeat + this.beatsCounted;

        const totalBeats = Math.floor(beatsElapsedSinceSet);

        this.currentBar = Math.floor(totalBeats / 4);
        this.currentBeat = totalBeats % 4;

        this.beatProgress = beatsElapsedSinceSet;
        this.barProgress = beatsElapsedSinceSet / 4;

        return {
            currentBar: this.currentBar,
            currentBeat: this.currentBeat,
            beatProgress: this.beatProgress,
            barProgress: this.barProgress
        }
    }

    setInputStream(stream: MediaStream) {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        if(this.sourceNode) {
            this.sourceNode.disconnect(this.analyserNode);
        }

        this.sourceNode = this.ctx.createMediaStreamSource(stream);
        this.sourceNode.connect(this.analyserNode);
    }

    getFFTData() : Float32Array {
        const min = this.analyserNode.minDecibels;
        const max = this.analyserNode.maxDecibels;
        this.analyserNode.getFloatFrequencyData(this.fftData);
        return this.fftData.map(value => Math.max((value - min) / (max - min), 0));
    }

}