import makeAubio, { type Tempo } from "aubiojs";

export interface BeatData {
  bpm: number;
  timestamp: number;
}

class BeatDetectorProcessor
  extends AudioWorkletProcessor
  implements AudioWorkletProcessorImpl
{
  tempo?: Tempo;

  constructor() {
    super();
    makeAubio().then((aubioInstance) => {
      this.tempo = new aubioInstance.Tempo(128 * 4, 128, sampleRate);
    });
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean {
    if (!this.tempo) {
      return true;
    }

    const input = inputs[0];

    if (this.tempo.do(input[0])) {
      const data: BeatData = {
        bpm: this.tempo.getBpm(),
        timestamp: Date.now(),
      };
      this.port.postMessage(data);
    }

    return true;
  }
}

registerProcessor("beat-detector", BeatDetectorProcessor);
