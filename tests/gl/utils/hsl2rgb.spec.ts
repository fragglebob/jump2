import { describe, it, expect } from "vitest";
import { hslToRgb } from "../../../src/gl/utils/hsl2rgb";

describe("hsl2rgb", () => {

    it("no saturation would equal the just the lightness", () => {
        expect(hslToRgb(0, 0, 0.1337)).toEqual([0.1337, 0.1337, 0.1337])
    });

    it("make red values", () => {
        expect(hslToRgb(0, 1, 0.5)).toEqual([1, 0, 0])
    });

    it("make green values", () => {
        expect(hslToRgb(1/3, 1, 0.5)).toEqual([0, 1, 0])
    });

    it("make blue values", () => {
        expect(hslToRgb(2/3, 1, 0.5)).toEqual([0, 0, 1])
    });

});