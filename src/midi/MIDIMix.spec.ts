import { describe, it, expect } from "vitest";
import { MIDIMix } from "./MIDIMix";

const midiMixInput: MIDIInput = {
    name: "MIDI Mix",
    manufacturer: "AKAI"
} as MIDIInput;

const CC = 0b10110000;

describe("MIDIMix", () => {
    it("should set all the knobs and sliders to 0 to start", () => {
        const mix = new MIDIMix();

        expect(mix.sliders).toEqual(Array.from({ length: 9 }, () => 0))
        expect(mix.knobs).toEqual(Array.from({ length: 24 }, () => 0))
    });

    it("should decode a knob event", () => {
        const mix = new MIDIMix();
        const values = Array.from(
            { length: 24 },
            () => Math.floor(Math.random()*127)
        );

        values.forEach((value, i) => {
            const y = i % 3;
            const x = Math.floor(i / 3);

            let index = x * 4 + y + 16;

            if (x >= 4) {
                index += 14;
            }

            mix.receiveMessageEvent(midiMixInput, new Uint8Array([CC, index, value]))
        });

        expect(mix.knobs).toEqual(values.map(v => v/127));
    });

    it("should decode a slider event", () => {
        const mix = new MIDIMix();

        const values = Array.from(
            { length: 9 },
            () => Math.floor(Math.random()*127)
        );

        values.forEach((value, i) => {
            let index = i * 4 + 16;

            if (i < 8) {
                index += 3
            }

            if (i >= 4) {
                index += 14;
            }

            mix.receiveMessageEvent(midiMixInput, new Uint8Array([CC, index, value]))
        });

        expect(mix.sliders).toEqual(values.map(v => v/127));
    });

    it("should return zero for all out of range knobs", () => {
        const mix = new MIDIMix();

        expect(mix.getKnob(-1)).toBe(0);
        expect(mix.getKnob(9)).toBe(0);
    });

    it("should return zero for all out of range sliders", () => {
        const mix = new MIDIMix();

        expect(mix.getSlider(-1)).toBe(0);
        expect(mix.getSlider(24)).toBe(0);
    });
})
