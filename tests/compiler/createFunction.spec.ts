import { createFunction } from "../../src/compiler/createFunction";
import { createParser } from "../../src/parser/parser";
describe("createFunction", () => {
    it("should return a function with two arguments", () => {
        const result = createFunction(createParser() ,"sin(123)");

        expect(result).toBeInstanceOf(Function);
        expect(result.length).toBe(2);
    })
})