import aubio, {Aubio, Tempo} from "aubiojs";

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

    private aubioScriptProcessor: ScriptProcessorNode;
    private aubioTempo: Tempo

    private sourceNode?: MediaStreamAudioSourceNode;

    private fftData: Float32Array;

    private constructor(ctx: AudioContext, aubio: Aubio) {
        this.ctx = ctx;

        this.aubioScriptProcessor = ctx.createScriptProcessor(512, 1, 1);
        this.aubioTempo = new aubio.Tempo(
            this.aubioScriptProcessor.bufferSize * 4,
            this.aubioScriptProcessor.bufferSize,
            ctx.sampleRate
        );

        this.aubioScriptProcessor.addEventListener("audioprocess", (event) => {
            if (this.aubioTempo.do(event.inputBuffer.getChannelData(0))) {
                console.log("confidence", this.aubioTempo.getConfidence(), "tempo", this.aubioTempo.getBpm());
                this.handleBeat(this.aubioTempo.getBpm())
            }
        });

        this.analyserNode = this.setupAnalyserNode();
        this.gainNode = this.setupGainNode();

        this.analyserNode.connect(this.aubioScriptProcessor);
        this.aubioScriptProcessor.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);

        this.fftData = new Float32Array(this.analyserNode.frequencyBinCount);
    }

    static async make(): Promise<Analyser> {
        const ctx = new AudioContext();

        const aubioInstance = await aubio();

        return new Analyser(ctx, aubioInstance);
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

    private handleBeat(tempo: number) {
        this.tempoSetTime = Date.now() / 1000;
        this.tempo = tempo;
        this.beatsCounted++;
        console.log(this.updateBeat());
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