import nearley from "nearley";
import type { Block } from "./ast";
import jumpGrammer from "./jumpGrammer";

const grammer = nearley.Grammar.fromCompiled(jumpGrammer);

export function createParser() {
    return new nearley.Parser(grammer);
}

export function parse(text: string): Block {
    const parser = createParser();
    parser.feed(text);
    const result = parser.finish();
    if (result.length > 1) {
        throw new Error("Ambiguous input text, something wrong with grammer");
    } else if (result.length === 0) {
        throw new Error("Grammer gave no result for input");
    }
    return result[0];
}