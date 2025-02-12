import { describe, expect, it } from "vitest";

import { compileAST } from "../../src/compiler/compileAST";
import type { Block } from "../../src/parser/ast";
import { parse } from "../../src/parser/parser";

function buildASTFromString(code: string): Block {
  return parse(code);
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
    expect(result).toMatchInlineSnapshot(`"state['foo'] = "bar""`);
  });

  it("should handle a variable key being set", () => {
    const result = compileAST(buildASTFromString(`foo.bar = "baz"`));
    expect(result).toMatchInlineSnapshot(`"state['foo']['bar'] = "baz""`);
  });

  it("should handle a variable square bracket being set", () => {
    const result = compileAST(
      buildASTFromString(`foo.bing[bar[sin(34) * (4 - 13.37)]] = "baz"`),
    );
    expect(result).toMatchInlineSnapshot(
      `"state['foo']['bing'][state['bar'][Math.sin(34) * (4 - 13.37)]] = "baz""`,
    );
  });

  it("should handle subtractions without spaces - just numbers", () => {
    const result = compileAST(buildASTFromString(`foo = 3-2`));
    expect(result).toMatchInlineSnapshot(`"state['foo'] = 3 - 2"`);
  });

  it("should handle subtractions without spaces - func before", () => {
    const result = compileAST(buildASTFromString(`foo = time()-2`));
    expect(result).toMatchInlineSnapshot(`"state['foo'] = manager.time() - 2"`);
  });

  it("should handle subtractions without spaces - func after", () => {
    const result = compileAST(buildASTFromString(`foo = 3-time()`));
    expect(result).toMatchInlineSnapshot(`"state['foo'] = 3 - manager.time()"`);
  });

  it("should handle subtractions without spaces - func both", () => {
    const result = compileAST(buildASTFromString(`foo = time()-time()`));
    expect(result).toMatchInlineSnapshot(
      `"state['foo'] = manager.time() - manager.time()"`,
    );
  });

  it("should handle a variable set to an empty array", () => {
    const result = compileAST(buildASTFromString(`foo = []`));
    expect(result).toMatchInlineSnapshot(`"state['foo'] = []"`);
  });

  it("should handle a variable set to a mixed array", () => {
    const result = compileAST(
      buildASTFromString(`foo = [123, "bar", sin(3), ["inner"]]`),
    );
    expect(result).toMatchInlineSnapshot(`
          "state['foo'] = [
            123,
            "bar",
            Math.sin(3),
            [
              "inner"
            ]
          ]"
        `);
  });

  it("should handle a variable set to an empty object", () => {
    const result = compileAST(buildASTFromString(`foo = {}`));
    expect(result).toMatchInlineSnapshot(`"state['foo'] = {}"`);
  });

  it("should handle a variable set to an object with a named key", () => {
    const result = compileAST(buildASTFromString(`foo = { bar: "baz" }`));
    expect(result).toMatchInlineSnapshot(`
          "state['foo'] = {
            bar: "baz"
          }"
        `);
  });

  it("should handle a variable set to an object with a string key", () => {
    const result = compileAST(buildASTFromString(`foo = { "bar-baz": "baz" }`));
    expect(result).toMatchInlineSnapshot(`
          "state['foo'] = {
            "bar-baz": "baz"
          }"
        `);
  });

  it("should handle a variable set to an object with a expression key", () => {
    const result = compileAST(
      buildASTFromString(`foo = { [sin(9.3)]: "baz" }`),
    );
    expect(result).toMatchInlineSnapshot(`
          "state['foo'] = {
            [Math.sin(9.3)]: "baz"
          }"
        `);
  });

  it("should handle a variable set with a object with many mixed keys", () => {
    const result = compileAST(
      buildASTFromString(`
            foo = {
                bar: 1,
                "baz": 2,
                ["baa"]: 3,
                [sin(4)]: 4,
                something: "else"
            }
        `),
    );
    expect(result).toMatchInlineSnapshot(`
          "state['foo'] = {
            bar: 1,
            "baz": 2,
            "baa": 3,
            [Math.sin(4)]: 4,
            something: "else"
          }"
        `);
  });

  it("should handle a variable set with a deep nested object", () => {
    const result = compileAST(
      buildASTFromString(`
            foo = {
                bar: {
                    baz: {
                        nested: {
                            array: [  234, { "with-an-object": { "inside": "boo" } } ]
                        }
                    }
                }
            }
        `),
    );
    expect(result).toMatchInlineSnapshot(`
          "state['foo'] = {
            bar: {
              baz: {
                nested: {
                  array: [
                    234,
                    {
                      "with-an-object": {
                        "inside": "boo"
                      }
                    }
                  ]
                }
              }
            }
          }"
        `);
  });

  describe("if", () => {
    it("should handle a if statement", () => {
      const result = compileAST(
        buildASTFromString(`
                if foo < bar then
                    x = cos(foo / 3)
                endif
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"if (state['foo'] < state['bar']) {
  state['x'] = Math.cos(state['foo'] / 3)
}"
`);
    });

    it("should handle a if...else statement", () => {
      const result = compileAST(
        buildASTFromString(`
                if foo < bar then
                    x = cos(foo / 3)
                else
                    x = cos(bar % 4)
                endif
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"if (state['foo'] < state['bar']) {
  state['x'] = Math.cos(state['foo'] / 3)
} else {
  state['x'] = Math.cos(state['bar'] % 4)
}"
`);
    });

    it("should handle a if...elseif statement", () => {
      const result = compileAST(
        buildASTFromString(`
                if foo < bar then
                    x = cos(foo / 3)
                elseif bar == foo then
                    x = cos(bar % 4)
                endif
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"if (state['foo'] < state['bar']) {
  state['x'] = Math.cos(state['foo'] / 3)
} elseif (state['bar'] == state['foo']) {
  state['x'] = Math.cos(state['bar'] % 4)
}"
`);
    });

    it("should handle a if...elseif...else statement", () => {
      const result = compileAST(
        buildASTFromString(`
                if foo < bar then
                    x = cos(foo / 3)
                elseif bar == foo then
                    x = cos(bar % 4)
                else 
                    x = cos(bar + bar)
                endif
            `),
      );
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
      const result = compileAST(
        buildASTFromString(`
                if foo && bar || (foo && somethingElse) then
                    x = cos(foo / 3)
                    y = sin(bar * 1111)
                endif
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"if (state['foo'] && state['bar'] || (state['foo'] && state['somethingElse'])) {
  state['x'] = Math.cos(state['foo'] / 3)
  state['y'] = Math.sin(state['bar'] * 1111)
}"
`);
    });
  });

  describe("loops", () => {
    it("should handle a while loop", () => {
      const result = compileAST(
        buildASTFromString(`
                something = 0
                while something < 10 then
                    y = sin(45 + y)
                    something = something + 1
                endwhile
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"state['something'] = 0
while (state['something'] < 10 {
  state['y'] = Math.sin(45 + state['y'])
  state['something'] = state['something'] + 1
}"
`);
    });

    it("should handle a forin ranged loop - forward", () => {
      const result = compileAST(
        buildASTFromString(`
                for x in 1..10 then
                    y = sin(45 + x)
                endfor
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (state['x'] = 1; state['x'] < 10; state['x']++) {
  state['y'] = Math.sin(45 + state['x'])
}"
`);
    });

    it("should handle a forin ranged loop - backwards", () => {
      const result = compileAST(
        buildASTFromString(`
                for x in 10..0 then
                    y = sin(45 + x)
                endfor
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (state['x'] = 10; state['x'] > 0; state['x']--) {
  state['y'] = Math.sin(45 + state['x'])
}"
`);
    });

    it("should handle a forin ranged loop - same number", () => {
      const result = compileAST(
        buildASTFromString(`
                for x in 5..5 then
                    y = sin(45 + x)
                endfor
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (state['x'] = 5; state['x'] < 5; state['x']++) {
  state['y'] = Math.sin(45 + state['x'])
}"
`);
    });

    it("should handle a forin array loop", () => {
      const result = compileAST(
        buildASTFromString(`
                for x in [1, 2, 4, 8, 16] then
                    y = sin(45 + x)
                endfor
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (state['x'] of [
  1,
  2,
  4,
  8,
  16
]) {
  state['y'] = Math.sin(45 + state['x'])
}"
`);
    });

    it("should handle a forin variable loop", () => {
      const result = compileAST(
        buildASTFromString(`
                for x in someVar then
                    y = sin(45 + x)
                endfor
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (state['x'] of state['someVar']) {
  state['y'] = Math.sin(45 + state['x'])
}"
`);
    });

    it("should handle a forin function loop", () => {
      const result = compileAST(
        buildASTFromString(`
                for x in sin([1,2,3,4,5]) then
                    y = sin(45 + x)
                endfor
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (state['x'] of Math.sin([
  1,
  2,
  3,
  4,
  5
])) {
  state['y'] = Math.sin(45 + state['x'])
}"
`);
    });

    it("should handle a loop loop", () => {
      const result = compileAST(
        buildASTFromString(`
                loop 7 times
                    y = sin(45 + y)
                endloop
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (let i = 0; i < 7; i++) {
  state['y'] = Math.sin(45 + state['y'])
}"
`);
    });

    it("should handle a setting loop loop", () => {
      const result = compileAST(
        buildASTFromString(`
                loop x <- 7 times
                    y = sin(x)
                endloop
            `),
      );
      expect(result).toMatchInlineSnapshot(`
"for (state['x'] = 0; state['x'] < 7; state['x']++) {
  state['y'] = Math.sin(state['x'])
}"
`);
    });
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
  });

  describe("functions", () => {
    describe("maths", () => {
      it("should handle a cos call", () => {
        const result = compileAST(buildASTFromString(`cos(123)`));
        expect(result).toMatchInlineSnapshot(`"Math.cos(123)"`);
      });
      it("should handle a sin call", () => {
        const result = compileAST(buildASTFromString(`sin(123)`));
        expect(result).toMatchInlineSnapshot(`"Math.sin(123)"`);
      });

      it("should handle a round call", () => {
        const result = compileAST(buildASTFromString(`round(123)`));
        expect(result).toMatchInlineSnapshot(`"Math.round(123)"`);
      });
      it("should handle a floor call", () => {
        const result = compileAST(buildASTFromString(`floor(123)`));
        expect(result).toMatchInlineSnapshot(`"Math.floor(123)"`);
      });
      it("should handle a ceil call", () => {
        const result = compileAST(buildASTFromString(`ceil(123)`));
        expect(result).toMatchInlineSnapshot(`"Math.ceil(123)"`);
      });

      it("should handle a pow call", () => {
        const result = compileAST(buildASTFromString(`pow(123, 3)`));
        expect(result).toMatchInlineSnapshot(`"Math.pow(123, 3)"`);
      });

      it("should handle a sqrt call", () => {
        const result = compileAST(buildASTFromString(`sqrt(123)`));
        expect(result).toMatchInlineSnapshot(`"Math.sqrt(123)"`);
      });

      it("should handle a log call", () => {
        const result = compileAST(buildASTFromString(`log(123)`));
        expect(result).toMatchInlineSnapshot(`"Math.log(123)"`);
      });

      it("should handle a min call", () => {
        const result = compileAST(buildASTFromString(`min(123, 456)`));
        expect(result).toMatchInlineSnapshot(`"Math.min(123, 456)"`);
      });
      it("should handle a max call", () => {
        const result = compileAST(buildASTFromString(`max(123, 456)`));
        expect(result).toMatchInlineSnapshot(`"Math.max(123, 456)"`);
      });
    });

    it("should handle a box call", () => {
      const result = compileAST(buildASTFromString(`box()`));
      expect(result).toMatchInlineSnapshot(`"manager.box()"`);
    });

    it("should handle a ball call", () => {
      const result = compileAST(buildASTFromString(`ball()`));
      expect(result).toMatchInlineSnapshot(`"manager.ball()"`);
    });

    it("should handle a pushMatrix call", () => {
      const result = compileAST(buildASTFromString(`pushMatrix()`));
      expect(result).toMatchInlineSnapshot(`"manager.pushMatrix()"`);
    });
    it("should handle a popMatrix call", () => {
      const result = compileAST(buildASTFromString(`popMatrix()`));
      expect(result).toMatchInlineSnapshot(`"manager.popMatrix()"`);
    });

    it("should handle a scale call - 1", () => {
      const result = compileAST(buildASTFromString(`scale(1.1)`));
      expect(result).toMatchInlineSnapshot(`"manager.scale(1.1)"`);
    });
    it("should handle a scale call - 2", () => {
      const result = compileAST(buildASTFromString(`scale(1.1, 1.3, 1.5)`));
      expect(result).toMatchInlineSnapshot(`"manager.scale(1.1, 1.3, 1.5)"`);
    });

    it("should handle a translate call", () => {
      const result = compileAST(buildASTFromString(`translate(15, 10, 5)`));
      expect(result).toMatchInlineSnapshot(`"manager.translate(15, 10, 5)"`);
    });

    it("should handle a rotateX call", () => {
      const result = compileAST(buildASTFromString(`rotateX(123)`));
      expect(result).toMatchInlineSnapshot(`"manager.rotateX(123)"`);
    });
    it("should handle a rotateY call", () => {
      const result = compileAST(buildASTFromString(`rotateY(123)`));
      expect(result).toMatchInlineSnapshot(`"manager.rotateY(123)"`);
    });
    it("should handle a rotateZ call", () => {
      const result = compileAST(buildASTFromString(`rotateZ(123)`));
      expect(result).toMatchInlineSnapshot(`"manager.rotateZ(123)"`);
    });

    it("should handle a rgb call", () => {
      const result = compileAST(buildASTFromString(`rgb(1, 0.5, 0.2)`));
      expect(result).toMatchInlineSnapshot(`"manager.rgb(1, 0.5, 0.2)"`);
    });
    it("should handle a hsl call", () => {
      const result = compileAST(buildASTFromString(`hsl(1, 0.5, 0.2)`));
      expect(result).toMatchInlineSnapshot(`"manager.hsl(1, 0.5, 0.2)"`);
    });

    it("should handle a rgba call", () => {
      const result = compileAST(buildASTFromString(`rgba(1, 0.5, 0.2, 0.5)`));
      expect(result).toMatchInlineSnapshot(`"manager.rgba(1, 0.5, 0.2, 0.5)"`);
    });
    it("should handle a hsla call", () => {
      const result = compileAST(buildASTFromString(`hsla(1, 0.5, 0.2, 0.5)`));
      expect(result).toMatchInlineSnapshot(`"manager.hsla(1, 0.5, 0.2, 0.5)"`);
    });

    it("should handle a time call", () => {
      const result = compileAST(buildASTFromString(`time()`));
      expect(result).toMatchInlineSnapshot(`"manager.time()"`);
    });

    it("should handle a frame call", () => {
      const result = compileAST(buildASTFromString(`frame()`));
      expect(result).toMatchInlineSnapshot(`"manager.frame()"`);
    });

    it("should handle a knob call", () => {
      const result = compileAST(buildASTFromString(`knob(1)`));
      expect(result).toMatchInlineSnapshot(`"manager.knob(1)"`);
    });

    it("should handle a slider call", () => {
      const result = compileAST(buildASTFromString(`slider(4)`));
      expect(result).toMatchInlineSnapshot(`"manager.slider(4)"`);
    });
  });
});
