// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
	return d[0];
}

interface NearleyToken {
	value: any;
	[key: string]: any;
}

interface NearleyLexer {
	reset: (chunk: string, info: any) => void;
	next: () => NearleyToken | undefined;
	save: () => any;
	formatError: (token: never) => string;
	has: (tokenType: string) => boolean;
}

interface NearleyRule {
	name: string;
	symbols: NearleySymbol[];
	postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol =
	| string
	| { literal: any }
	| { test: (token: any) => boolean };

interface Grammar {
	Lexer: NearleyLexer | undefined;
	ParserRules: NearleyRule[];
	ParserStart: string;
}

const grammar: Grammar = {
	Lexer: undefined,
	ParserRules: [
		{ name: "main", symbols: ["_", "Block", "_"], postprocess: (d) => d[1] },
		{ name: "Block", symbols: ["_Block"], postprocess: id },
		{
			name: "_Block",
			symbols: ["Statement"],
			postprocess: (d) => ({ type: "block", statements: [d[0]] }),
		},
		{
			name: "_Block",
			symbols: ["_Block", "__", "Statement"],
			postprocess: (d) => ({
				type: "block",
				statements: [...d[0].statements, d[2]],
			}),
		},
		{ name: "Statement", symbols: ["FunctionCalls"], postprocess: id },
		{
			name: "Statement",
			symbols: ["Var", "_", { literal: "=" }, "_", "Expression"],
			postprocess: (d) => ({ type: "assignment", set: d[0], to: d[4] }),
		},
		{
			name: "Statement$string$1",
			symbols: [{ literal: "i" }, { literal: "f" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$2",
			symbols: [
				{ literal: "t" },
				{ literal: "h" },
				{ literal: "e" },
				{ literal: "n" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement",
			symbols: [
				"Statement$string$1",
				"__",
				"Expression",
				"__",
				"Statement$string$2",
				"__",
				"Block",
				"__",
				"Else",
			],
			postprocess: (d) => ({
				type: "if",
				condition: d[2],
				then: d[6],
				else: d[8],
			}),
		},
		{
			name: "Statement$string$3",
			symbols: [
				{ literal: "w" },
				{ literal: "h" },
				{ literal: "i" },
				{ literal: "l" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$4",
			symbols: [
				{ literal: "t" },
				{ literal: "h" },
				{ literal: "e" },
				{ literal: "n" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$5",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "w" },
				{ literal: "h" },
				{ literal: "i" },
				{ literal: "l" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement",
			symbols: [
				"Statement$string$3",
				"__",
				"Expression",
				"__",
				"Statement$string$4",
				"__",
				"Block",
				"__",
				"Statement$string$5",
			],
			postprocess: (d) => ({ type: "while", condition: d[2], then: d[6] }),
		},
		{
			name: "Statement$string$6",
			symbols: [
				{ literal: "l" },
				{ literal: "o" },
				{ literal: "o" },
				{ literal: "p" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$7",
			symbols: [{ literal: "<" }, { literal: "-" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$8",
			symbols: [
				{ literal: "t" },
				{ literal: "i" },
				{ literal: "m" },
				{ literal: "e" },
				{ literal: "s" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$9",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "l" },
				{ literal: "o" },
				{ literal: "o" },
				{ literal: "p" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement",
			symbols: [
				"Statement$string$6",
				"__",
				"NamedVariable",
				"__",
				"Statement$string$7",
				"__",
				"Expression",
				"__",
				"Statement$string$8",
				"__",
				"Block",
				"__",
				"Statement$string$9",
			],
			postprocess: (d) => ({
				type: "loop",
				times: d[6],
				then: d[10],
				setting: d[2],
			}),
		},
		{
			name: "Statement$string$10",
			symbols: [
				{ literal: "l" },
				{ literal: "o" },
				{ literal: "o" },
				{ literal: "p" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$11",
			symbols: [
				{ literal: "t" },
				{ literal: "i" },
				{ literal: "m" },
				{ literal: "e" },
				{ literal: "s" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$12",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "l" },
				{ literal: "o" },
				{ literal: "o" },
				{ literal: "p" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement",
			symbols: [
				"Statement$string$10",
				"__",
				"Expression",
				"__",
				"Statement$string$11",
				"__",
				"Block",
				"__",
				"Statement$string$12",
			],
			postprocess: (d) => ({ type: "loop", times: d[2], then: d[6] }),
		},
		{
			name: "Statement$string$13",
			symbols: [{ literal: "f" }, { literal: "o" }, { literal: "r" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$14",
			symbols: [{ literal: "i" }, { literal: "n" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$15",
			symbols: [
				{ literal: "t" },
				{ literal: "h" },
				{ literal: "e" },
				{ literal: "n" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement$string$16",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "f" },
				{ literal: "o" },
				{ literal: "r" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Statement",
			symbols: [
				"Statement$string$13",
				"__",
				"NamedVariable",
				"__",
				"Statement$string$14",
				"__",
				"Iterable",
				"__",
				"Statement$string$15",
				"__",
				"Block",
				"__",
				"Statement$string$16",
			],
			postprocess: (d) => ({
				type: "forin",
				setting: d[2],
				over: d[6],
				then: d[10],
			}),
		},
		{
			name: "Else$string$1",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "i" },
				{ literal: "f" },
			],
			postprocess: (d) => d.join(""),
		},
		{ name: "Else", symbols: ["Else$string$1"], postprocess: () => null },
		{
			name: "Else$string$2",
			symbols: [
				{ literal: "e" },
				{ literal: "l" },
				{ literal: "s" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Else$string$3",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "i" },
				{ literal: "f" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Else",
			symbols: ["Else$string$2", "__", "Block", "__", "Else$string$3"],
			postprocess: (d) => d[2],
		},
		{
			name: "Else$string$4",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "i" },
				{ literal: "f" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Else",
			symbols: ["_ElseIf", "__", "Else$string$4"],
			postprocess: (d) => d[0][0],
		},
		{
			name: "Else$string$5",
			symbols: [
				{ literal: "e" },
				{ literal: "l" },
				{ literal: "s" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Else$string$6",
			symbols: [
				{ literal: "e" },
				{ literal: "n" },
				{ literal: "d" },
				{ literal: "i" },
				{ literal: "f" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Else",
			symbols: [
				"_ElseIf",
				"__",
				"Else$string$5",
				"__",
				"Block",
				"__",
				"Else$string$6",
			],
			postprocess: (d) => {
				d[0][d[0].length - 1].else = d[4];
				return d[0][0];
			},
		},
		{
			name: "_ElseIf$string$1",
			symbols: [
				{ literal: "e" },
				{ literal: "l" },
				{ literal: "s" },
				{ literal: "e" },
				{ literal: "i" },
				{ literal: "f" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "_ElseIf$string$2",
			symbols: [
				{ literal: "t" },
				{ literal: "h" },
				{ literal: "e" },
				{ literal: "n" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "_ElseIf",
			symbols: [
				"_ElseIf$string$1",
				"__",
				"Expression",
				"__",
				"_ElseIf$string$2",
				"__",
				"Block",
			],
			postprocess: (d) => [
				{ type: "if", condition: d[2], then: d[6], else: null },
			],
		},
		{
			name: "_ElseIf$string$3",
			symbols: [
				{ literal: "e" },
				{ literal: "l" },
				{ literal: "s" },
				{ literal: "e" },
				{ literal: "i" },
				{ literal: "f" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "_ElseIf$string$4",
			symbols: [
				{ literal: "t" },
				{ literal: "h" },
				{ literal: "e" },
				{ literal: "n" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "_ElseIf",
			symbols: [
				"_ElseIf",
				"__",
				"_ElseIf$string$3",
				"__",
				"Expression",
				"__",
				"_ElseIf$string$4",
				"__",
				"Block",
			],
			postprocess: (d) => {
				const thisIf = { type: "if", condition: d[4], then: d[8], else: null };
				d[0][d[0].length - 1].else = thisIf;
				return [...d[0], thisIf];
			},
		},
		{ name: "Iterable", symbols: ["Range"], postprocess: id },
		{ name: "Iterable", symbols: ["Var"], postprocess: id },
		{ name: "Iterable", symbols: ["FunctionCalls"], postprocess: id },
		{ name: "Iterable", symbols: ["Array"], postprocess: id },
		{
			name: "Range$string$1",
			symbols: [{ literal: "." }, { literal: "." }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "Range",
			symbols: ["Number", "Range$string$1", "Number"],
			postprocess: (d) => ({ type: "range", from: d[0], to: d[2] }),
		},
		{ name: "Var", symbols: ["NamedVariable"], postprocess: id },
		{
			name: "Var",
			symbols: [
				"Var",
				"_",
				{ literal: "[" },
				"_",
				"Expression",
				"_",
				{ literal: "]" },
			],
			postprocess: (d) => ({ type: "key_access", key: d[4], from: d[0] }),
		},
		{
			name: "Var",
			symbols: ["Var", "_", { literal: "." }, "_", "Name"],
			postprocess: (d) => ({ type: "key_access", key: d[4], from: d[0] }),
		},
		{
			name: "NamedVariable",
			symbols: ["Name"],
			postprocess: (d) => ({ type: "variable", name: d[0] }),
		},
		{ name: "FunctionCalls", symbols: ["MathsFunctions"], postprocess: id },
		{ name: "FunctionCalls", symbols: ["WorldFunctions"], postprocess: id },
		{ name: "FunctionCalls", symbols: ["ShapeFunctions"], postprocess: id },
		{ name: "FunctionCalls", symbols: ["UtilFunctions"], postprocess: id },
		{ name: "FunctionCalls", symbols: ["StyleFunctions"], postprocess: id },
		{ name: "FunctionCalls", symbols: ["FXFunctions"], postprocess: id },
		{
			name: "FXFunctions$string$1",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "k" },
				{ literal: "a" },
				{ literal: "l" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$1", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_kale", args: d[2] }),
		},
		{
			name: "FXFunctions$string$2",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "g" },
				{ literal: "r" },
				{ literal: "i" },
				{ literal: "d" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$2", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_grid", args: d[2] }),
		},
		{
			name: "FXFunctions$string$3",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "p" },
				{ literal: "x" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$3", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_px", args: d[2] }),
		},
		{
			name: "FXFunctions$string$4",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "r" },
				{ literal: "g" },
				{ literal: "b" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$4", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_rgb", args: d[2] }),
		},
		{
			name: "FXFunctions$string$5",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "b" },
				{ literal: "l" },
				{ literal: "o" },
				{ literal: "o" },
				{ literal: "m" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$5", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_bloom", args: d[2] }),
		},
		{
			name: "FXFunctions$string$6",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "f" },
				{ literal: "e" },
				{ literal: "e" },
				{ literal: "d" },
				{ literal: "b" },
				{ literal: "a" },
				{ literal: "c" },
				{ literal: "k" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$6", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_feedback", args: d[2] }),
		},
		{
			name: "FXFunctions$string$7",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "w" },
				{ literal: "a" },
				{ literal: "r" },
				{ literal: "p" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$7", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_warp", args: d[2] }),
		},
		{
			name: "FXFunctions$string$8",
			symbols: [
				{ literal: "f" },
				{ literal: "x" },
				{ literal: "_" },
				{ literal: "a" },
				{ literal: "s" },
				{ literal: "c" },
				{ literal: "i" },
				{ literal: "i" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FXFunctions",
			symbols: ["FXFunctions$string$8", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "fx_ascii", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$1",
			symbols: [{ literal: "s" }, { literal: "i" }, { literal: "n" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$1", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "sin", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$2",
			symbols: [{ literal: "c" }, { literal: "o" }, { literal: "s" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$2", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "cos", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$3",
			symbols: [{ literal: "p" }, { literal: "o" }, { literal: "w" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$3", "_", "2Args"],
			postprocess: (d) => ({ type: "func", name: "pow", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$4",
			symbols: [
				{ literal: "s" },
				{ literal: "q" },
				{ literal: "r" },
				{ literal: "t" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$4", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "sqrt", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$5",
			symbols: [{ literal: "l" }, { literal: "o" }, { literal: "g" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$5", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "log", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$6",
			symbols: [{ literal: "m" }, { literal: "a" }, { literal: "x" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$6", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "max", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$7",
			symbols: [{ literal: "m" }, { literal: "i" }, { literal: "n" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$7", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "min", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$8",
			symbols: [
				{ literal: "r" },
				{ literal: "o" },
				{ literal: "u" },
				{ literal: "n" },
				{ literal: "d" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$8", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "round", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$9",
			symbols: [
				{ literal: "f" },
				{ literal: "l" },
				{ literal: "o" },
				{ literal: "o" },
				{ literal: "r" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$9", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "floor", args: d[2] }),
		},
		{
			name: "MathsFunctions$string$10",
			symbols: [
				{ literal: "c" },
				{ literal: "e" },
				{ literal: "i" },
				{ literal: "l" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "MathsFunctions",
			symbols: ["MathsFunctions$string$10", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "ceil", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$1",
			symbols: [
				{ literal: "t" },
				{ literal: "i" },
				{ literal: "m" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$1", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "time", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$2",
			symbols: [
				{ literal: "f" },
				{ literal: "r" },
				{ literal: "a" },
				{ literal: "m" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$2", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "frame", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$3",
			symbols: [
				{ literal: "b" },
				{ literal: "e" },
				{ literal: "a" },
				{ literal: "t" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$3", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "beat", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$4",
			symbols: [{ literal: "b" }, { literal: "a" }, { literal: "r" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$4", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "bar", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$5",
			symbols: [
				{ literal: "b" },
				{ literal: "e" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "_" },
				{ literal: "p" },
				{ literal: "r" },
				{ literal: "o" },
				{ literal: "g" },
				{ literal: "r" },
				{ literal: "e" },
				{ literal: "s" },
				{ literal: "s" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$5", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "beat_progress", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$6",
			symbols: [
				{ literal: "b" },
				{ literal: "a" },
				{ literal: "r" },
				{ literal: "_" },
				{ literal: "p" },
				{ literal: "r" },
				{ literal: "o" },
				{ literal: "g" },
				{ literal: "r" },
				{ literal: "e" },
				{ literal: "s" },
				{ literal: "s" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$6", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "bar_progress", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$7",
			symbols: [
				{ literal: "b" },
				{ literal: "e" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "_" },
				{ literal: "r" },
				{ literal: "a" },
				{ literal: "w" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$7", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "beat_raw", args: d[2] }),
		},
		{
			name: "UtilFunctions$string$8",
			symbols: [{ literal: "f" }, { literal: "f" }, { literal: "t" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "UtilFunctions",
			symbols: ["UtilFunctions$string$8", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "fft", args: d[2] }),
		},
		{
			name: "WorldFunctions$string$1",
			symbols: [
				{ literal: "p" },
				{ literal: "u" },
				{ literal: "s" },
				{ literal: "h" },
				{ literal: "M" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "r" },
				{ literal: "i" },
				{ literal: "x" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "WorldFunctions",
			symbols: ["WorldFunctions$string$1", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "pushMatrix", args: d[2] }),
		},
		{
			name: "WorldFunctions$string$2",
			symbols: [
				{ literal: "p" },
				{ literal: "o" },
				{ literal: "p" },
				{ literal: "M" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "r" },
				{ literal: "i" },
				{ literal: "x" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "WorldFunctions",
			symbols: ["WorldFunctions$string$2", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "popMatrix", args: d[2] }),
		},
		{
			name: "WorldFunctions$string$3",
			symbols: [
				{ literal: "t" },
				{ literal: "r" },
				{ literal: "a" },
				{ literal: "n" },
				{ literal: "s" },
				{ literal: "l" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "WorldFunctions",
			symbols: ["WorldFunctions$string$3", "_", "3Args"],
			postprocess: (d) => ({ type: "func", name: "translate", args: d[2] }),
		},
		{
			name: "WorldFunctions$string$4",
			symbols: [
				{ literal: "r" },
				{ literal: "o" },
				{ literal: "t" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "e" },
				{ literal: "X" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "WorldFunctions",
			symbols: ["WorldFunctions$string$4", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "rotateX", args: d[2] }),
		},
		{
			name: "WorldFunctions$string$5",
			symbols: [
				{ literal: "r" },
				{ literal: "o" },
				{ literal: "t" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "e" },
				{ literal: "Y" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "WorldFunctions",
			symbols: ["WorldFunctions$string$5", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "rotateY", args: d[2] }),
		},
		{
			name: "WorldFunctions$string$6",
			symbols: [
				{ literal: "r" },
				{ literal: "o" },
				{ literal: "t" },
				{ literal: "a" },
				{ literal: "t" },
				{ literal: "e" },
				{ literal: "Z" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "WorldFunctions",
			symbols: ["WorldFunctions$string$6", "_", "1Args"],
			postprocess: (d) => ({ type: "func", name: "rotateZ", args: d[2] }),
		},
		{
			name: "WorldFunctions$string$7",
			symbols: [
				{ literal: "s" },
				{ literal: "c" },
				{ literal: "a" },
				{ literal: "l" },
				{ literal: "e" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "WorldFunctions",
			symbols: ["WorldFunctions$string$7", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "scale", args: d[2] }),
		},
		{
			name: "ShapeFunctions$string$1",
			symbols: [{ literal: "b" }, { literal: "o" }, { literal: "x" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ShapeFunctions",
			symbols: ["ShapeFunctions$string$1", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "box", args: d[2] }),
		},
		{
			name: "ShapeFunctions$string$2",
			symbols: [
				{ literal: "b" },
				{ literal: "a" },
				{ literal: "l" },
				{ literal: "l" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ShapeFunctions",
			symbols: ["ShapeFunctions$string$2", "_", "0Args"],
			postprocess: (d) => ({ type: "func", name: "ball", args: d[2] }),
		},
		{
			name: "StyleFunctions$string$1",
			symbols: [{ literal: "r" }, { literal: "g" }, { literal: "b" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "StyleFunctions",
			symbols: ["StyleFunctions$string$1", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "rgb", args: d[2] }),
		},
		{
			name: "StyleFunctions$string$2",
			symbols: [
				{ literal: "r" },
				{ literal: "g" },
				{ literal: "b" },
				{ literal: "a" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "StyleFunctions",
			symbols: ["StyleFunctions$string$2", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "rgba", args: d[2] }),
		},
		{
			name: "StyleFunctions$string$3",
			symbols: [{ literal: "h" }, { literal: "s" }, { literal: "l" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "StyleFunctions",
			symbols: ["StyleFunctions$string$3", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "hsl", args: d[2] }),
		},
		{
			name: "StyleFunctions$string$4",
			symbols: [
				{ literal: "h" },
				{ literal: "s" },
				{ literal: "l" },
				{ literal: "a" },
			],
			postprocess: (d) => d.join(""),
		},
		{
			name: "StyleFunctions",
			symbols: ["StyleFunctions$string$4", "_", "NArgs"],
			postprocess: (d) => ({ type: "func", name: "hsla", args: d[2] }),
		},
		{
			name: "ExpressionList",
			symbols: ["Expression"],
			postprocess: (d) => [d[0]],
		},
		{
			name: "ExpressionList",
			symbols: ["ExpressionList", "_", { literal: "," }, "_", "Expression"],
			postprocess: (d) => [...d[0], d[4]],
		},
		{
			name: "NArgs",
			symbols: [{ literal: "(" }, "_", { literal: ")" }],
			postprocess: () => ({ type: "arguments", value: [] }),
		},
		{
			name: "NArgs",
			symbols: [{ literal: "(" }, "_", "ExpressionList", "_", { literal: ")" }],
			postprocess: (d) => ({ type: "arguments", value: d[2] }),
		},
		{
			name: "0Args",
			symbols: [{ literal: "(" }, "_", { literal: ")" }],
			postprocess: () => ({ type: "arguments", value: [] }),
		},
		{
			name: "1Args",
			symbols: [{ literal: "(" }, "_", "Expression", "_", { literal: ")" }],
			postprocess: (d) => ({ type: "arguments", value: [d[2]] }),
		},
		{
			name: "2Args",
			symbols: [
				{ literal: "(" },
				"_",
				"Expression",
				"_",
				{ literal: "," },
				"_",
				"Expression",
				"_",
				{ literal: ")" },
			],
			postprocess: (d) => ({ type: "arguments", value: [d[2], d[6]] }),
		},
		{
			name: "3Args",
			symbols: [
				{ literal: "(" },
				"_",
				"Expression",
				"_",
				{ literal: "," },
				"_",
				"Expression",
				"_",
				{ literal: "," },
				"_",
				"Expression",
				"_",
				{ literal: ")" },
			],
			postprocess: (d) => ({ type: "arguments", value: [d[2], d[6], d[10]] }),
		},
		{
			name: "Parenthesized",
			symbols: [{ literal: "(" }, "_", "Expression", "_", { literal: ")" }],
			postprocess: (d) => ({ type: "parenthesized", value: d[2] }),
		},
		{ name: "Expression", symbols: ["Binop"], postprocess: id },
		{ name: "Binop", symbols: ["ExpOr"], postprocess: id },
		{
			name: "ExpOr$string$1",
			symbols: [{ literal: "|" }, { literal: "|" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ExpOr",
			symbols: ["ExpOr", "_", "ExpOr$string$1", "_", "ExpAnd"],
			postprocess: (d) => ({
				type: "binary",
				left: d[0],
				right: d[4],
				operation: "||",
			}),
		},
		{ name: "ExpOr", symbols: ["ExpAnd"], postprocess: id },
		{
			name: "ExpAnd$string$1",
			symbols: [{ literal: "&" }, { literal: "&" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ExpAnd",
			symbols: ["ExpAnd", "_", "ExpAnd$string$1", "_", "ExpComparison"],
			postprocess: (d) => ({
				type: "binary",
				left: d[0],
				right: d[4],
				operation: "&&",
			}),
		},
		{ name: "ExpAnd", symbols: ["ExpComparison"], postprocess: id },
		{
			name: "ExpComparison",
			symbols: ["ExpComparison", "_", { literal: "<" }, "_", "ExpSum"],
			postprocess: (d) => ({
				type: "comparison",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpComparison",
			symbols: ["ExpComparison", "_", { literal: ">" }, "_", "ExpSum"],
			postprocess: (d) => ({
				type: "comparison",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpComparison$string$1",
			symbols: [{ literal: "<" }, { literal: "=" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ExpComparison",
			symbols: ["ExpComparison", "_", "ExpComparison$string$1", "_", "ExpSum"],
			postprocess: (d) => ({
				type: "comparison",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpComparison$string$2",
			symbols: [{ literal: ">" }, { literal: "=" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ExpComparison",
			symbols: ["ExpComparison", "_", "ExpComparison$string$2", "_", "ExpSum"],
			postprocess: (d) => ({
				type: "comparison",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpComparison$string$3",
			symbols: [{ literal: "=" }, { literal: "=" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ExpComparison",
			symbols: ["ExpComparison", "_", "ExpComparison$string$3", "_", "ExpSum"],
			postprocess: (d) => ({
				type: "comparison",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpComparison$string$4",
			symbols: [{ literal: "!" }, { literal: "=" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "ExpComparison",
			symbols: ["ExpComparison", "_", "ExpComparison$string$4", "_", "ExpSum"],
			postprocess: (d) => ({
				type: "comparison",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{ name: "ExpComparison", symbols: ["ExpSum"], postprocess: id },
		{
			name: "ExpSum",
			symbols: ["ExpSum", "_", { literal: "+" }, "_", "ExpProduct"],
			postprocess: (d) => ({
				type: "sum",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpSum",
			symbols: ["ExpSum", "_", { literal: "-" }, "_", "ExpProduct"],
			postprocess: (d) => ({
				type: "sum",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{ name: "ExpSum", symbols: ["ExpProduct"], postprocess: id },
		{
			name: "ExpProduct",
			symbols: ["ExpProduct", "_", { literal: "*" }, "_", "Atom"],
			postprocess: (d) => ({
				type: "product",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpProduct",
			symbols: ["ExpProduct", "_", { literal: "/" }, "_", "Atom"],
			postprocess: (d) => ({
				type: "product",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{
			name: "ExpProduct",
			symbols: ["ExpProduct", "_", { literal: "%" }, "_", "Atom"],
			postprocess: (d) => ({
				type: "product",
				left: d[0],
				right: d[4],
				operation: d[2],
			}),
		},
		{ name: "ExpProduct", symbols: ["Atom"], postprocess: id },
		{ name: "Atom", symbols: ["Number"], postprocess: id },
		{ name: "Atom", symbols: ["String"], postprocess: id },
		{ name: "Atom", symbols: ["Var"], postprocess: id },
		{ name: "Atom", symbols: ["Parenthesized"], postprocess: id },
		{ name: "Atom", symbols: ["FunctionCalls"], postprocess: id },
		{ name: "Atom", symbols: ["Array"], postprocess: id },
		{ name: "Atom", symbols: ["Object"], postprocess: id },
		{
			name: "Array",
			symbols: [{ literal: "[" }, "_", { literal: "]" }],
			postprocess: (d) => ({ type: "array", value: [] }),
		},
		{
			name: "Array",
			symbols: [{ literal: "[" }, "_", "ExpressionList", "_", { literal: "]" }],
			postprocess: (d) => ({ type: "array", value: d[2] }),
		},
		{
			name: "Object",
			symbols: [{ literal: "{" }, "_", { literal: "}" }],
			postprocess: (d) => ({ type: "object", entries: [] }),
		},
		{
			name: "Object",
			symbols: [
				{ literal: "{" },
				"_",
				"ObjectEntryList",
				"_",
				{ literal: "}" },
			],
			postprocess: (d) => ({ type: "object", entries: d[2] }),
		},
		{
			name: "ObjectEntryList",
			symbols: ["ObjectEntry"],
			postprocess: (d) => [d[0]],
		},
		{
			name: "ObjectEntryList",
			symbols: ["ObjectEntryList", "_", { literal: "," }, "_", "ObjectEntry"],
			postprocess: (d) => [...d[0], d[4]],
		},
		{
			name: "ObjectEntry",
			symbols: ["ObjectKey", "_", { literal: ":" }, "_", "Expression"],
			postprocess: (d) => ({ type: "object_entry", key: d[0], value: d[4] }),
		},
		{
			name: "ObjectKey",
			symbols: ["Name"],
			postprocess: (d) => ({ type: "object_key", value: d[0] }),
		},
		{
			name: "ObjectKey",
			symbols: ["String"],
			postprocess: (d) => ({ type: "object_key", value: d[0] }),
		},
		{
			name: "ObjectKey",
			symbols: [{ literal: "[" }, "_", "Expression", "_", { literal: "]" }],
			postprocess: (d) => ({ type: "object_key", value: d[2] }),
		},
		{
			name: "Number",
			symbols: ["_number"],
			postprocess: (d) => ({ type: "number", value: d[0] }),
		},
		{ name: "_posint", symbols: [/[0-9]/], postprocess: id },
		{
			name: "_posint",
			symbols: ["_posint", /[0-9]/],
			postprocess: (d) => d[0] + d[1],
		},
		{
			name: "_int",
			symbols: [{ literal: "-" }, "_posint"],
			postprocess: (d) => d[0] + d[1],
		},
		{ name: "_int", symbols: ["_posint"], postprocess: id },
		{ name: "_float", symbols: ["_int"], postprocess: id },
		{
			name: "_float",
			symbols: ["_int", { literal: "." }, "_posint"],
			postprocess: (d) => d[0] + d[1] + d[2],
		},
		{ name: "_number", symbols: ["_float"], postprocess: id },
		{
			name: "_number",
			symbols: ["_float", { literal: "e" }, "_int"],
			postprocess: (d) => d[0] + d[1] + d[2],
		},
		{
			name: "String",
			symbols: [{ literal: '"' }, "_string", { literal: '"' }],
			postprocess: (d) => ({ type: "string", value: '"' + d[1] + '"' }),
		},
		{ name: "_string", symbols: [], postprocess: () => "" },
		{
			name: "_string",
			symbols: ["_string", "_stringchar"],
			postprocess: (d) => d[0] + d[1],
		},
		{ name: "_stringchar", symbols: [/[^\\"]/], postprocess: id },
		{
			name: "_stringchar",
			symbols: [{ literal: "\\" }, /[^]/],
			postprocess: (d) => JSON.parse('"' + d[0] + d[1] + '"'),
		},
		{
			name: "Name",
			symbols: ["_name"],
			postprocess: (d) => ({ type: "name", value: d[0] }),
		},
		{ name: "_name", symbols: [/[a-zA-Z_]/], postprocess: id },
		{
			name: "_name",
			symbols: ["_name", /[\w_]/],
			postprocess: (d) => d[0] + d[1],
		},
		{ name: "_", symbols: [] },
		{ name: "_", symbols: ["_", /[\s]/], postprocess: () => {} },
		{ name: "__", symbols: [/[\s]/] },
		{ name: "__", symbols: ["__", /[\s]/], postprocess: () => {} },
	],
	ParserStart: "main",
};

export default grammar;
