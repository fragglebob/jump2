// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var comparison: any;
declare var sum: any;
declare var product: any;
declare var number: any;
declare var string: any;
declare var variableName: any;
declare var ws: any;
declare var nl: any;

    // Moo lexer documention is here:
    // https://github.com/no-context/moo

    const moo = require("moo")
    const lexer = moo.compile({
        ws:     /[ \t]+/,
        number:  [
			/(?:-?(?:0|[1-9][0-9]*)?\.[0-9]+)/,   // [123].123
			/(?:-?(?:0|[1-9][0-9]*)\.[0-9]*)/,    // 123.[123]
			/(?:0|-?[1-9][0-9]*)/,              // 123
		],
		binops: ["&&", "||"],
		comparison: ["<", ">", "<=", ">=", "==", "!="],
		sum: ["+", "-"],
		product: ["*", "/", "%"],
        string:  /"(?:\\["\\]|[^\n"\\])*"/,
        lparen:  '(',
        rparen:  ')',
	    lqb:  '[',
        rqb:  ']',
		dot: '.',
		eq: '=',
		comma: ',',
		nl: { match: /\r|\r\n|\n/, lineBreaks: true },
		variableName: /[\w_][\w\d_]*/,
		keywords: ["if", "else", "then", "elseif", "endif"]
		
    });

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "main", "symbols": ["_", "Block", "_"], "postprocess": (d) => d[1]},
    {"name": "Block", "symbols": ["_Block"], "postprocess": id},
    {"name": "_Block", "symbols": ["Statement"], "postprocess": (d) => ({ type: "block", statements: [ d[0] ] })},
    {"name": "_Block", "symbols": ["_Block", "__", "Statement"], "postprocess": (d) => ({ type: "block", statements: [ ...d[0].statements, d[2] ] })},
    {"name": "Statement", "symbols": ["FunctionCalls"], "postprocess": id},
    {"name": "Statement", "symbols": ["Var", "_", {"literal":"="}, "_", "Expression"], "postprocess": (d) => ({ type: "assignment", set: d[0], to: d[4] })},
    {"name": "Statement", "symbols": [{"literal":"if"}, "__", "Expression", "__", {"literal":"then"}, "__", "Block", "__", "Else"], "postprocess": (d) => ({ type: "if", condition: d[2], then: d[6], else: d[8] })},
    {"name": "Else", "symbols": [{"literal":"endif"}], "postprocess": () => null},
    {"name": "Else", "symbols": [{"literal":"else"}, "__", "Block", "__", {"literal":"endif"}], "postprocess": (d) => d[2]},
    {"name": "Else", "symbols": ["_ElseIf", "__", {"literal":"endif"}], "postprocess": (d) => d[0][0]},
    {"name": "Else", "symbols": ["_ElseIf", "__", {"literal":"else"}, "__", "Block", "__", {"literal":"endif"}], "postprocess":  (d) => {
        	d[0][d[0].length - 1].else = d[4];
        	return d[0][0];
        } },
    {"name": "_ElseIf", "symbols": [{"literal":"elseif"}, "__", "Expression", "__", {"literal":"then"}, "__", "Block"], "postprocess": (d) => [{ type: "if", condition: d[2], then: d[6], else: null }]},
    {"name": "_ElseIf", "symbols": ["_ElseIf", "__", {"literal":"elseif"}, "__", "Expression", "__", {"literal":"then"}, "__", "Block"], "postprocess":  (d) => {
        	const thisIf = { type: "if", condition: d[4], then: d[8], else: null };
        	d[0][d[0].length - 1].else = thisIf;
        	return [...d[0], thisIf];
        } },
    {"name": "Var", "symbols": ["Name"], "postprocess": (d) => ({ type: "variable", name: d[0] })},
    {"name": "Var", "symbols": ["Var", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}], "postprocess": (d) => ({ type: "key_access", key: d[4], from: d[0] })},
    {"name": "Var", "symbols": ["Var", "_", {"literal":"."}, "_", "Name"], "postprocess": (d) => ({ type: "key_access", key: d[4], from: d[0] })},
    {"name": "Name", "symbols": ["_name"], "postprocess": (d) => ({ type: "name", value: d[0] })},
    {"name": "FunctionCalls", "symbols": ["MathsFunctions"], "postprocess": id},
    {"name": "MathsFunctions", "symbols": [{"literal":"sin"}, "_", "Args"], "postprocess": (d) => ({ type: "func", name: "sin", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"cos"}, "_", "Args"], "postprocess": (d) => ({ type: "func", name: "cos", args: d[2] })},
    {"name": "ExpressionList", "symbols": ["Expression"], "postprocess": (d) => [d[0]]},
    {"name": "ExpressionList", "symbols": ["ExpressionList", "_", {"literal":","}, "_", "Expression"], "postprocess": (d) => [...d[0], d[4]]},
    {"name": "Args", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": () => ({ type: "arguments", value: [] })},
    {"name": "Args", "symbols": [{"literal":"("}, "_", "ExpressionList", "_", {"literal":")"}], "postprocess": (d) => ({ type: "arguments", value: d[2] })},
    {"name": "Parenthesized", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":")"}], "postprocess": (d) => ({ type: "parenthesized", value: d[2] })},
    {"name": "Expression", "symbols": ["Binop"], "postprocess": id},
    {"name": "Binop", "symbols": ["ExpOr"], "postprocess": id},
    {"name": "ExpOr", "symbols": ["ExpOr", "_", {"literal":"||"}, "_", "ExpAnd"], "postprocess": (d) => ({ type: "binary", left: d[0], right: d[4], operation: "||" })},
    {"name": "ExpOr", "symbols": ["ExpAnd"], "postprocess": id},
    {"name": "ExpAnd", "symbols": ["ExpAnd", "_", {"literal":"&&"}, "_", "ExpComparison"], "postprocess": (d) => ({ type: "binary", left: d[0], right: d[4], operation: "&&" })},
    {"name": "ExpAnd", "symbols": ["ExpComparison"], "postprocess": id},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", (lexer.has("comparison") ? {type: "comparison"} : comparison), "_", "ExpSum"], "postprocess": (d) => ({ type: "comparison", left: d[0], right: d[4], operation: d[2].text })},
    {"name": "ExpComparison", "symbols": ["ExpSum"], "postprocess": id},
    {"name": "ExpSum", "symbols": ["ExpSum", "_", (lexer.has("sum") ? {type: "sum"} : sum), "_", "ExpProduct"], "postprocess": (d) => ({ type: "sum", left: d[0], right: d[4], operation: d[2].text })},
    {"name": "ExpSum", "symbols": ["ExpProduct"], "postprocess": id},
    {"name": "ExpProduct", "symbols": ["ExpProduct", "_", (lexer.has("product") ? {type: "product"} : product), "_", "Atom"], "postprocess": (d) => ({ type: "product", left: d[0], right: d[4], operation: d[2].text })},
    {"name": "ExpProduct", "symbols": ["Atom"], "postprocess": id},
    {"name": "Atom", "symbols": ["Number"], "postprocess": id},
    {"name": "Atom", "symbols": ["String"], "postprocess": id},
    {"name": "Atom", "symbols": ["Var"], "postprocess": id},
    {"name": "Atom", "symbols": ["Parenthesized"], "postprocess": id},
    {"name": "Atom", "symbols": ["FunctionCalls"], "postprocess": id},
    {"name": "Number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => ({ type: "number", value: d[0].value })},
    {"name": "String", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => ({ type: "string", value: d[0].value })},
    {"name": "_name", "symbols": [(lexer.has("variableName") ? {type: "variableName"} : variableName)], "postprocess": (d) => d[0].value},
    {"name": "_", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null},
    {"name": "_", "symbols": ["_", (lexer.has("nl") ? {type: "nl"} : nl)], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)], "postprocess": () => null},
    {"name": "__", "symbols": ["__", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null},
    {"name": "__", "symbols": ["__", (lexer.has("nl") ? {type: "nl"} : nl)], "postprocess": () => null}
  ],
  ParserStart: "main",
};

export default grammar;
