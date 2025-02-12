import { describe, expect, it } from "vitest";
import { createFunction } from "../../src/compiler/createFunction";
describe("createFunction", () => {
  it("should return a function with two arguments", () => {
    const result = createFunction("sin(123)");

    expect(result).toBeInstanceOf(Function);
    expect(result.length).toBe(2);
  });
});
