import { Parser } from "nearley";
import { describe, expect, it } from "vitest";
import { createParser, parse } from "../../src/parser/parser";

describe("createParser", () => {
  it("should return a new parser", () => {
    const parser = createParser();
    expect(parser).toBeInstanceOf(Parser);
  });
});

describe("parser", () => {
  describe("stings", () => {
    it("should build ast for a string", () => {
      const result = parse(`foo = "super string"`);
      expect(result).toMatchSnapshot();
    });
  });

  describe("variables", () => {
    describe("usage", () => {
      it("should build ast for using a variable", () => {
        const result = parse(`foo = bar`);
        expect(result).toMatchSnapshot();
      });

      it("should build ast for using a key of variable", () => {
        const result = parse(`foo = bar.baz`);
        expect(result).toMatchSnapshot();
      });

      it("should build ast for using a index of variable", () => {
        const result = parse(`foo = bar["baz"]`);
        expect(result).toMatchSnapshot();
      });
    });

    describe("assignment", () => {
      it("should build ast for assignment of varaible", () => {
        const result = parse(`foo = "bar"`);
        expect(result).toMatchSnapshot();
      });

      it("should build ast for key assignment of variable", () => {
        const result = parse(`foo.bar = "baz"`);
        expect(result).toMatchSnapshot();
      });

      it("should build ast for square bracket assignment of variable", () => {
        const result = parse(`foo["bar"] = "baz"`);
        expect(result).toMatchSnapshot();
      });

      it("should build ast for square bracket then key assignment of variable", () => {
        const result = parse(`foo["bar"].foo = "baz"`);
        expect(result).toMatchSnapshot();
      });

      it("should build ast for key then square bracket assignment of variable", () => {
        const result = parse(`foo.bar["foo"] = "baz"`);
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe("numbers", () => {
    it("should build ast for a positive interger", () => {
      const result = parse("foo = 5");
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a negative interger", () => {
      const result = parse("foo = -5");
      expect(result).toMatchSnapshot();
    });

    it("should build ast for zero", () => {
      const result = parse("foo = 0");
      expect(result).toMatchSnapshot();
    });

    it("should build ast for decimal", () => {
      const result = parse("foo = 13.37");
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a negative decimal", () => {
      const result = parse("foo = -13.37");
      expect(result).toMatchSnapshot();
    });
  });

  describe("arrays", () => {
    it("build ast for an empty array", () => {
      const result = parse(`
                foo = []
            `);
      expect(result).toMatchSnapshot();
    });
    it("build ast for an array with one item", () => {
      const result = parse(`
                foo = [0]
            `);
      expect(result).toMatchSnapshot();
    });
    it("build ast for an array with three mixed item", () => {
      const result = parse(`
                foo = [0, "foo", sin(44)]
            `);
      expect(result).toMatchSnapshot();
    });
  });

  describe("objects", () => {
    it("build ast for an empty object", () => {
      const result = parse(`
                foo = {}
            `);
      expect(result).toMatchSnapshot();
    });

    it("build ast for an object with a name key", () => {
      const result = parse(`
                foo = {
                    bar: "baz"
                }
            `);
      expect(result).toMatchSnapshot();
    });

    it("build ast for an object with a string key", () => {
      const result = parse(`
                foo = {
                    "bar-bar": "baz"
                }
            `);
      expect(result).toMatchSnapshot();
    });

    it("build ast for an object with an expression key", () => {
      const result = parse(`
                foo = {
                    [sin(5)]: "baz"
                }
            `);
      expect(result).toMatchSnapshot();
    });

    it("build ast for an object with many named keys", () => {
      const result = parse(`
                foo = {
                    bar: 1,
                    baz: 2,
                    baa: 3
                }
            `);
      expect(result).toMatchSnapshot();
    });

    it("build ast for an object with mixed keys", () => {
      const result = parse(`
                foo = {
                    bar: 1,
                    "baz": 2,
                    ["baa"]: 3,
                    [sin(4)]: 4,
                    something: "else"
                }
            `);
      expect(result).toMatchSnapshot();
    });

    it("build ast for an object with nested objects", () => {
      const result = parse(`
                foo = {
                    bar: {
                        baz: {
                            nested: {
                                array: [  234, { "with-an-object": { "inside": "boo" } } ]
                            }
                        }
                    }
                }
            `);
      expect(result).toMatchSnapshot();
    });
  });

  describe("functions", () => {
    it("should build ast for a sin call", () => {
      const result = parse("sin(3)");
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a cos call", () => {
      const result = parse("cos(3)");
      expect(result).toMatchSnapshot();
    });
  });

  describe("if blocks", () => {
    it("should build ast for a if statement", () => {
      const result = parse(`
                if 2 > 1 then
                    sin(3)
                endif
            `);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a if...else statement", () => {
      const result = parse(`
                if 2 > 1 then
                    sin(3)
                else
                    sin(2)
                endif
            `);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a if...elseif statement", () => {
      const result = parse(`
                if 2 > 1 then
                    sin(3)
                elseif 4 < 2 then
                    sin(2)
                endif
            `);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a if...elseif...else statement", () => {
      const result = parse(`
                if 2 > 1 then
                    sin(3)
                elseif 4 < 2 then
                    sin(5444)
                else
                    sin(2)
                endif
            `);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a if...elseif...elseif...elseif...else statement", () => {
      const result = parse(`
                if 2 > 1 then
                    sin(3)
                elseif 4 < 2 then
                    sin(5444)
                elseif 545 > 89 then
                    sin(123)
                elseif 234 <= sin(3) * 234 then
                    sin(123)
                else
                    sin(2)
                endif
            `);
      expect(result).toMatchSnapshot();
    });
  });

  describe("expressions", () => {
    it("should build ast for addition", () => {
      const result = parse(`foo = 3 + 2`);
      expect(result).toMatchSnapshot();
    });
    it("should build ast for subtraction", () => {
      const result = parse(`foo = 3 - 2`);
      expect(result).toMatchSnapshot();
    });
    it("should build ast for times", () => {
      const result = parse(`foo = 3 * 2`);
      expect(result).toMatchSnapshot();
    });
    it("should build ast for divide", () => {
      const result = parse(`foo = 3 / 2`);
      expect(result).toMatchSnapshot();
    });
    it("should build ast for mod", () => {
      const result = parse(`foo = 3 % 2`);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for >", () => {
      const result = parse(`foo = 3 > 2`);
      expect(result).toMatchSnapshot();
    });
    it("should build ast for >=", () => {
      const result = parse(`foo = 3 >= 2`);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for <", () => {
      const result = parse(`foo = 3 < 2`);
      expect(result).toMatchSnapshot();
    });
    it("should build ast for <=", () => {
      const result = parse(`foo = 3 <= 2`);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for ==", () => {
      const result = parse(`foo = 3 == 2`);
      expect(result).toMatchSnapshot();
    });
    it("should build ast for !=", () => {
      const result = parse(`foo = 3 != 2`);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for boolean or logic", () => {
      const result = parse(`foo = 0.5 > sin(224) || 0.5 < sin(124)`);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for boolean and logic", () => {
      const result = parse(`foo = 0.5 > sin(224) && 0.5 < sin(124)`);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a combination of boolean logic", () => {
      const result = parse(`foo = sin(224) && (0 != cos(0) || sin(0) >= 0)`);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for brackets", () => {
      const result = parse(`foo = (234 * ((sin(5) - 8) / (988 + sin(592))))`);
      expect(result).toMatchSnapshot();
    });
  });

  describe("loops", () => {
    it("should build ast for a while statement", () => {
      const result = parse(`
                while 2 > 1 then
                    sin(3)
                endwhile
            `);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a for in statement", () => {
      const result = parse(`
                for i in 0..10 then
                    sin(3)
                endfor
            `);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a loop statement", () => {
      const result = parse(`
                loop 800 times
                    y = cos(3)
                endloop
            `);
      expect(result).toMatchSnapshot();
    });

    it("should build ast for a setting loop statement", () => {
      const result = parse(`
                loop x <- 800 times
                    y = cos(x)
                endloop
            `);
      expect(result).toMatchSnapshot();
    });
  });
});
