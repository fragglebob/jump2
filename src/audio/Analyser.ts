
export class Analyser {

    private ctx: AudioContext;

    private analyserNode: AnalyserNode;
    private gainNode: GainNode;

    private sourceNode?: MediaStreamAudioSourceNode;

    private fftData: Float32Array;

    constructor() {
        this.ctx = new AudioContext();
        this.analyserNode = this.setupAnalyserNode();
        this.gainNode = this.setupGainNode();

        this.analyserNode.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);

        this.fftData = new Float32Array(this.analyserNode.frequencyBinCount);
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