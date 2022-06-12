import { compileAST } from "../../src/compiler/compileAST";
import { Block } from "../../src/parser/ast";
import { parse } from "../../src/parser/parser";

function buildASTFromString(code: string): Block {
    return parse(code)
}

describe("compileAST", () => {

    it("should handle an empty block", () => {
        const result = compileAST({ type: "block", statements: [] });
        expect(result).toMatchInlineSnapshot(`""`);
    });

    it("should handle a function call with number", () => {
        const result = compileAST(buildASTFromString(`sin(-123.456)`));
        expect(result).toMatchInlineSnapshot(`"Math.sin(-123.456)"`);
    });

    it("should handle a variable being set", () => {
        const result = compileAST(buildASTFromString(`foo = "bar"`));
        expect(result).toMatchInlineSnapshot(`"state['foo'] = \\"bar\\""`);
    });

    it("should handle a variable key being set", () => {
        const result = compileAST(buildASTFromString(`foo.bar = "baz"`));
        expect(result).toMatchInlineSnapshot(`"state['foo']['bar'] = \\"baz\\""`);
    });

    it("should handle a variable square bracket being set", () => {
        const result = compileAST(buildASTFromString(`foo.bing[bar[sin(34) * (4 - 13.37)]] = "baz"`));
        expect(result).toMatchInlineSnapshot(`"state['foo']['bing'][state['bar'][Math.sin(34) * (4 - 13.37)]] = \\"baz\\""`);
    });

    it("should handle a if statement", () => {
        const result = compileAST(buildASTFromString(`
            if foo < bar then
                x = cos(foo / 3)
            endif
        `));
        expect(result).toMatchInlineSnapshot(`
"if (state['foo'] < state['bar']) {
state['x'] = Math.cos(state['foo'] / 3)
}"
`);
    });

    it("should handle a if...else statement", () => {
        const result = compileAST(buildASTFromString(`
            if foo < bar then
                x = cos(foo / 3)
            else
                x = cos(bar % 4)
            endif
        `));
        expect(result).toMatchInlineSnapshot(`
"if (state['foo'] < state['bar']) {
state['x'] = Math.cos(state['foo'] / 3)
} else {
state['x'] = Math.cos(state['bar'] % 4)
}"
`);
    });

    it("should handle a if...elseif statement", () => {
        const result = compileAST(buildASTFromString(`
            if foo < bar then
                x = cos(foo / 3)
            elseif bar == foo then
                x = cos(bar % 4)
            endif
        `));
        expect(result).toMatchInlineSnapshot(`
"if (state['foo'] < state['bar']) {
state['x'] = Math.cos(state['foo'] / 3)
} elseif (state['bar'] == state['foo']) {
state['x'] = Math.cos(state['bar'] % 4)
}"
`);
    });

    it("should handle a if...elseif...else statement", () => {
        const result = compileAST(buildASTFromString(`
            if foo < bar then
                x = cos(foo / 3)
            elseif bar == foo then
                x = cos(bar % 4)
            else 
                x = cos(bar + bar)
            endif
        `));
        expect(result).toMatchInlineSnapshot(`
"if (state['foo'] < state['bar']) {
state['x'] = Math.cos(state['foo'] / 3)
} elseif (state['bar'] == state['foo']) {
state['x'] = Math.cos(state['bar'] % 4)
} else {
state['x'] = Math.cos(state['bar'] + state['bar'])
}"
`);
    });

    it("should handle binary logic", () => {
        const result = compileAST(buildASTFromString(`
            if foo && bar || (foo && somethingElse) then
                x = cos(foo / 3)
                y = sin(bar * 1111)
            endif
        `));
        expect(result).toMatchInlineSnapshot(`
"if (state['foo'] && state['bar'] || (state['foo'] && state['somethingElse'])) {
state['x'] = Math.cos(state['foo'] / 3)
state['y'] = Math.sin(state['bar'] * 1111)
}"
`);
    });

    describe("constants", () => {
        it("should treat a variable named false as false", () => {
            const result = compileAST(buildASTFromString(`foo = false`));
            expect(result).toMatchInlineSnapshot(`"state['foo'] = false"`);
        });
        it("should treat a variable named true as true", () => {
            const result = compileAST(buildASTFromString(`foo = true`));
            expect(result).toMatchInlineSnapshot(`"state['foo'] = true"`);
        });

        it("should treat a variable named null as null", () => {
            const result = compileAST(buildASTFromString(`foo = null`));
            expect(result).toMatchInlineSnapshot(`"state['foo'] = null"`);
        });
        it("should treat a variable named PI as Math.PI", () => {
            const result = compileAST(buildASTFromString(`foo = PI`));
            expect(result).toMatchInlineSnapshot(`"state['foo'] = Math.PI"`);
        });

        it("should not let constants have key access on them", () => {
            expect(() => compileAST(buildASTFromString(`foo = PI.bar`))).toThrow();
        });
    })

    

})