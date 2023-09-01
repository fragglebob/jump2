// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var doubledot: any;
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

    import moo from "moo";
    const lexer = moo.compile({
        ws:     /[ \t]+/,
        number:  [
            { match: /(?:-?(?:0|[1-9][0-9]*)\.[0-9]+)/ },   // 123.[123]
            { match: /(?:0|-?[1-9][0-9]*)/ },               // 123
        ],
        doubledot: '..',
		setting: '<-',
        binops: ["&&", "||"],
        comparison: ["<", ">", "<=", ">=", "==", "!="],
        sum: ["+", "-"],
        product: ["*", "/", "%"],
        string:  /"(?:\\["\\]|[^\n"\\])*"/,
        lparen:  '(',
        rparen:  ')',
        lqb:  '[',
        rqb:  ']',
		lcb:  '{',
        rcb:  '}',
        dot: '.',
        eq: '=',
        comma: ',',
		colon: ':',
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
    {"name": "Statement", "symbols": [{"literal":"while"}, "__", "Expression", "__", {"literal":"then"}, "__", "Block", "__", {"literal":"endwhile"}], "postprocess": (d) => ({ type: "while", condition: d[2], then: d[6] })},
    {"name": "Statement", "symbols": [{"literal":"loop"}, "__", "NamedVariable", "__", {"literal":"<-"}, "__", "Expression", "__", {"literal":"times"}, "__", "Block", "__", {"literal":"endloop"}], "postprocess": (d) => ({ type: "loop", times: d[6], then: d[10], setting: d[2] })},
    {"name": "Statement", "symbols": [{"literal":"loop"}, "__", "Expression", "__", {"literal":"times"}, "__", "Block", "__", {"literal":"endloop"}], "postprocess": (d) => ({ type: "loop", times: d[2], then: d[6] })},
    {"name": "Statement", "symbols": [{"literal":"for"}, "__", "NamedVariable", "__", {"literal":"in"}, "__", "Iterable", "__", {"literal":"then"}, "__", "Block", "__", {"literal":"endfor"}], "postprocess": (d) => ({ type: "forin", setting: d[2], over: d[6], then: d[10] })},
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
    {"name": "Iterable", "symbols": ["Range"], "postprocess": id},
    {"name": "Iterable", "symbols": ["Var"], "postprocess": id},
    {"name": "Iterable", "symbols": ["FunctionCalls"], "postprocess": id},
    {"name": "Iterable", "symbols": ["Array"], "postprocess": id},
    {"name": "Range", "symbols": ["Number", (lexer.has("doubledot") ? {type: "doubledot"} : doubledot), "Number"], "postprocess": (d) => ({ type: "range", from: d[0], to: d[2] })},
    {"name": "Var", "symbols": ["NamedVariable"], "postprocess": id},
    {"name": "Var", "symbols": ["Var", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}], "postprocess": (d) => ({ type: "key_access", key: d[4], from: d[0] })},
    {"name": "Var", "symbols": ["Var", "_", {"literal":"."}, "_", "Name"], "postprocess": (d) => ({ type: "key_access", key: d[4], from: d[0] })},
    {"name": "NamedVariable", "symbols": ["Name"], "postprocess": (d) => ({ type: "variable", name: d[0] })},
    {"name": "FunctionCalls", "symbols": ["MathsFunctions"], "postprocess": id},
    {"name": "FunctionCalls", "symbols": ["WorldFunctions"], "postprocess": id},
    {"name": "FunctionCalls", "symbols": ["ShapeFunctions"], "postprocess": id},
    {"name": "FunctionCalls", "symbols": ["UtilFunctions"], "postprocess": id},
    {"name": "FunctionCalls", "symbols": ["StyleFunctions"], "postprocess": id},
    {"name": "FunctionCalls", "symbols": ["FXFunctions"], "postprocess": id},
    {"name": "FXFunctions", "symbols": [{"literal":"fx_kale"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "fx_kale", args: d[2] })},
    {"name": "FXFunctions", "symbols": [{"literal":"fx_grid"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "fx_grid", args: d[2] })},
    {"name": "FXFunctions", "symbols": [{"literal":"fx_px"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "fx_px", args: d[2] })},
    {"name": "FXFunctions", "symbols": [{"literal":"fx_rgb"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "fx_rgb", args: d[2] })},
    {"name": "FXFunctions", "symbols": [{"literal":"fx_bloom"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "fx_bloom", args: d[2] })},
    {"name": "FXFunctions", "symbols": [{"literal":"fx_feedback"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "fx_feedback", args: d[2] })},
    {"name": "FXFunctions", "symbols": [{"literal":"fx_warp"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "fx_warp", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"sin"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "sin", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"cos"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "cos", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"pow"}, "_", "2Args"], "postprocess": (d) => ({ type: "func", name: "pow", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"sqrt"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "sqrt", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"log"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "log", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"max"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "max", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"min"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "min", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"round"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "round", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"floor"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "floor", args: d[2] })},
    {"name": "MathsFunctions", "symbols": [{"literal":"ceil"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "ceil", args: d[2] })},
    {"name": "UtilFunctions", "symbols": [{"literal":"time"}, "_", "0Args"], "postprocess": (d) => ({ type: "func", name: "time", args: d[2] })},
    {"name": "UtilFunctions", "symbols": [{"literal":"frame"}, "_", "0Args"], "postprocess": (d) => ({ type: "func", name: "frame", args: d[2] })},
    {"name": "UtilFunctions", "symbols": [{"literal":"fft"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "fft", args: d[2] })},
    {"name": "WorldFunctions", "symbols": [{"literal":"pushMatrix"}, "_", "0Args"], "postprocess": (d) => ({ type: "func", name: "pushMatrix", args: d[2] })},
    {"name": "WorldFunctions", "symbols": [{"literal":"popMatrix"}, "_", "0Args"], "postprocess": (d) => ({ type: "func", name: "popMatrix", args: d[2] })},
    {"name": "WorldFunctions", "symbols": [{"literal":"translate"}, "_", "3Args"], "postprocess": (d) => ({ type: "func", name: "translate", args: d[2] })},
    {"name": "WorldFunctions", "symbols": [{"literal":"rotateX"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "rotateX", args: d[2] })},
    {"name": "WorldFunctions", "symbols": [{"literal":"rotateY"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "rotateY", args: d[2] })},
    {"name": "WorldFunctions", "symbols": [{"literal":"rotateZ"}, "_", "1Args"], "postprocess": (d) => ({ type: "func", name: "rotateZ", args: d[2] })},
    {"name": "WorldFunctions", "symbols": [{"literal":"scale"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "scale", args: d[2] })},
    {"name": "ShapeFunctions", "symbols": [{"literal":"box"}, "_", "0Args"], "postprocess": (d) => ({ type: "func", name: "box", args: d[2] })},
    {"name": "ShapeFunctions", "symbols": [{"literal":"ball"}, "_", "0Args"], "postprocess": (d) => ({ type: "func", name: "ball", args: d[2] })},
    {"name": "StyleFunctions", "symbols": [{"literal":"rgb"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "rgb", args: d[2] })},
    {"name": "StyleFunctions", "symbols": [{"literal":"rgba"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "rgba", args: d[2] })},
    {"name": "StyleFunctions", "symbols": [{"literal":"hsl"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "hsl", args: d[2] })},
    {"name": "StyleFunctions", "symbols": [{"literal":"hsla"}, "_", "NArgs"], "postprocess": (d) => ({ type: "func", name: "hsla", args: d[2] })},
    {"name": "ExpressionList", "symbols": ["Expression"], "postprocess": (d) => [d[0]]},
    {"name": "ExpressionList", "symbols": ["ExpressionList", "_", {"literal":","}, "_", "Expression"], "postprocess": (d) => [...d[0], d[4]]},
    {"name": "NArgs", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": () => ({ type: "arguments", value: [] })},
    {"name": "NArgs", "symbols": [{"literal":"("}, "_", "ExpressionList", "_", {"literal":")"}], "postprocess": (d) => ({ type: "arguments", value: d[2] })},
    {"name": "0Args", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": () => ({ type: "arguments", value: [] })},
    {"name": "1Args", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":")"}], "postprocess": (d) => ({ type: "arguments", value: [d[2]] })},
    {"name": "2Args", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":","}, "_", "Expression", "_", {"literal":")"}], "postprocess": (d) => ({ type: "arguments", value: [d[2], d[6]] })},
    {"name": "3Args", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":","}, "_", "Expression", "_", {"literal":","}, "_", "Expression", "_", {"literal":")"}], "postprocess": (d) => ({ type: "arguments", value: [d[2], d[6], d[10]] })},
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
    {"name": "Atom", "symbols": ["Array"], "postprocess": id},
    {"name": "Atom", "symbols": ["Object"], "postprocess": id},
    {"name": "Array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": (d) => ({ type: "array", value: [] })},
    {"name": "Array", "symbols": [{"literal":"["}, "_", "ExpressionList", "_", {"literal":"]"}], "postprocess": (d) => ({ type: "array", value: d[2] })},
    {"name": "Object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": (d) => ({ type: "object", entries: [] })},
    {"name": "Object", "symbols": [{"literal":"{"}, "_", "ObjectEntryList", "_", {"literal":"}"}], "postprocess": (d) => ({ type: "object", entries: d[2] })},
    {"name": "ObjectEntryList", "symbols": ["ObjectEntry"], "postprocess": (d) => [d[0]]},
    {"name": "ObjectEntryList", "symbols": ["ObjectEntryList", "_", {"literal":","}, "_", "ObjectEntry"], "postprocess": (d) => [...d[0], d[4]]},
    {"name": "ObjectEntry", "symbols": ["ObjectKey", "_", {"literal":":"}, "_", "Expression"], "postprocess": (d) => ({ type: "object_entry", key: d[0], value: d[4] })},
    {"name": "ObjectKey", "symbols": ["Name"], "postprocess": (d) => ({ type: "object_key", value: d[0] })},
    {"name": "ObjectKey", "symbols": ["String"], "postprocess": (d) => ({ type: "object_key", value: d[0] })},
    {"name": "ObjectKey", "symbols": [{"literal":"["}, "_", "Expression", "_", {"literal":"]"}], "postprocess": (d) => ({ type: "object_key", value: d[2] })},
    {"name": "Number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => ({ type: "number", value: d[0].value })},
    {"name": "String", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => ({ type: "string", value: d[0].value })},
    {"name": "Name", "symbols": ["_name"], "postprocess": (d) => ({ type: "name", value: d[0] })},
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
