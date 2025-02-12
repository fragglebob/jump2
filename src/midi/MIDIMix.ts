import type { MIDIMessageHandler } from "./MIDIManager";
import { decodeMessage } from "./decodeMessage";

interface InputDevice {
  receiveMessageEvent: MIDIMessageHandler;
}

export class MIDIMix implements InputDevice {
  sliders: number[];
  knobs: number[];

  constructor() {
    this.sliders = Array.from({ length: 9 }, () => 0);
    this.knobs = Array.from({ length: 24 }, () => 0);
  }

  getKnob(index: number) {
    if (index < 0 || index >= 24) {
      return 0;
    }
    return this.knobs[index];
  }

  getSlider(index: number) {
    if (index < 0 || index >= 9) {
      return 0;
    }
    return this.sliders[index];
  }

  receiveMessageEvent(target: MIDIInput, data: Uint8Array | null) {
    if (target.manufacturer !== "AKAI" || target.name !== "MIDI Mix") {
      return;
    }

    if (!data) {
      return;
    }

    const message = decodeMessage(data);

    if (!message) {
      return;
    }

    if (message.type === "control_change") {
      let index = message.index - 16;
      if (index >= 30) {
        index -= 14;
      }
      const row = index % 4;
      const column = Math.floor(index / 4);

      const isSlider = row === 3 || index === 32;

      if (isSlider) {
        const sliderNumber = column;
        this.sliders[sliderNumber] = message.value / 127;
      } else {
        const knobNumber = column * 3 + row;
        this.knobs[knobNumber] = message.value / 127;
      }
    }
  }
}
