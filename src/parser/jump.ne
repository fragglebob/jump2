@preprocessor typescript

@{%
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
%}

# Pass your lexer with @lexer:
@lexer lexer

main -> _ Block _ {% (d) => d[1] %}

Block -> _Block {% id %}

_Block -> Statement {% (d) => ({ type: "block", statements: [ d[0] ] }) %}
    | _Block __ Statement {% (d) => ({ type: "block", statements: [ ...d[0].statements, d[2] ] }) %}

Statement -> FunctionCalls {% id %}
    | Var _ "=" _ Expression {% (d) => ({ type: "assignment", set: d[0], to: d[4] }) %}
    | "if" __ Expression __ "then" __ Block __ Else {% (d) => ({ type: "if", condition: d[2], then: d[6], else: d[8] }) %}
	| "while" __ Expression __ "then" __ Block __ "endwhile" {% (d) => ({ type: "while", condition: d[2], then: d[6] }) %}
	| "loop" __ NamedVariable __ "<-" __ Expression __ "times" __ Block __ "endloop" {% (d) => ({ type: "loop", times: d[6], then: d[10], setting: d[2] }) %}
	| "loop" __ Expression __ "times" __ Block __ "endloop" {% (d) => ({ type: "loop", times: d[2], then: d[6] }) %}
    | "for" __ NamedVariable __ "in" __ Iterable __ "then" __ Block __ "endfor" {% (d) => ({ type: "forin", setting: d[2], over: d[6], then: d[10] }) %}
    
    
Else -> "endif" {% () => null %}
    | "else" __ Block __ "endif" {% (d) => d[2] %}
    | _ElseIf __ "endif" {% (d) => d[0][0] %}
    | _ElseIf __ "else" __ Block __ "endif" {% (d) => {
    d[0][d[0].length - 1].else = d[4];
    return d[0][0];
} %}
 
_ElseIf ->       "elseif" __ Expression __ "then" __ Block {% (d) => [{ type: "if", condition: d[2], then: d[6], else: null }] %}
    | _ElseIf __ "elseif" __ Expression __ "then" __ Block {% (d) => {
    const thisIf = { type: "if", condition: d[4], then: d[8], else: null };
    d[0][d[0].length - 1].else = thisIf;
    return [...d[0], thisIf];
} %}
    

Iterable -> Range {% id %} 
    | Var {% id %}
    | FunctionCalls {% id %}
    | Array {% id %}
    
Range -> Number %doubledot Number {% (d) => ({ type: "range", from: d[0], to: d[2] }) %}


# Variables

Var -> NamedVariable {% id %}
    | Var _ "[" _ Expression _ "]" {% (d) => ({ type: "key_access", key: d[4], from: d[0] }) %} 
    | Var _ "." _ Name  {% (d) => ({ type: "key_access", key: d[4], from: d[0] }) %} 

NamedVariable -> Name {% (d) => ({ type: "variable", name: d[0] }) %}
    
FunctionCalls -> MathsFunctions {% id %}
    | WorldFunctions {% id %}
    | ShapeFunctions {% id %}
    | UtilFunctions {% id %}
	| StyleFunctions {% id %}
    | FXFunctions {% id %}

FXFunctions -> 
    "fx_kale" _ NArgs {% (d) => ({ type: "func", name: "fx_kale", args: d[2] }) %}
    | "fx_grid" _ NArgs {% (d) => ({ type: "func", name: "fx_grid", args: d[2] }) %}
    | "fx_px" _ NArgs {% (d) => ({ type: "func", name: "fx_px", args: d[2] }) %}
    | "fx_rgb" _ NArgs {% (d) => ({ type: "func", name: "fx_rgb", args: d[2] }) %}
    | "fx_bloom" _ NArgs {% (d) => ({ type: "func", name: "fx_bloom", args: d[2] }) %}
    | "fx_feedback" _ NArgs {% (d) => ({ type: "func", name: "fx_feedback", args: d[2] }) %}
    | "fx_warp" _ NArgs {% (d) => ({ type: "func", name: "fx_warp", args: d[2] }) %}
    | "fx_ascii" _ NArgs {% (d) => ({ type: "func", name: "fx_ascii", args: d[2] }) %}

MathsFunctions -> 
    "sin" _ 1Args {% (d) => ({ type: "func", name: "sin", args: d[2] }) %}
    | "cos" _ 1Args {% (d) => ({ type: "func", name: "cos", args: d[2] }) %}
    | "pow" _ 2Args {% (d) => ({ type: "func", name: "pow", args: d[2] }) %}
    | "sqrt" _ 1Args {% (d) => ({ type: "func", name: "sqrt", args: d[2] }) %}
    | "log" _ 1Args {% (d) => ({ type: "func", name: "log", args: d[2] }) %}
    | "max" _ NArgs {% (d) => ({ type: "func", name: "max", args: d[2] }) %}
    | "min" _ NArgs {% (d) => ({ type: "func", name: "min", args: d[2] }) %}
    | "round" _ 1Args {% (d) => ({ type: "func", name: "round", args: d[2] }) %}
    | "floor" _ 1Args {% (d) => ({ type: "func", name: "floor", args: d[2] }) %}
    | "ceil" _ 1Args {% (d) => ({ type: "func", name: "ceil", args: d[2] }) %}

UtilFunctions ->
    "time" _ 0Args {% (d) => ({ type: "func", name: "time", args: d[2] }) %} |
    "frame" _ 0Args {% (d) => ({ type: "func", name: "frame", args: d[2] }) %} |
    "beat" _ 0Args {% (d) => ({ type: "func", name: "beat", args: d[2] }) %} |
    "bar" _ 0Args {% (d) => ({ type: "func", name: "bar", args: d[2] }) %} |
    "beat_progress" _ 0Args {% (d) => ({ type: "func", name: "beat_progress", args: d[2] }) %} |
    "bar_progress" _ 0Args {% (d) => ({ type: "func", name: "bar_progress", args: d[2] }) %} |
    "beat_raw" _ 0Args {% (d) => ({ type: "func", name: "beat_raw", args: d[2] }) %} |
    "fft" _ 1Args {% (d) => ({ type: "func", name: "fft", args: d[2] }) %}

WorldFunctions -> 
    "pushMatrix" _ 0Args {% (d) => ({ type: "func", name: "pushMatrix", args: d[2] }) %}
    | "popMatrix" _ 0Args {% (d) => ({ type: "func", name: "popMatrix", args: d[2] }) %}
    | "translate" _ 3Args {% (d) => ({ type: "func", name: "translate", args: d[2] }) %}
    | "rotateX" _ 1Args {% (d) => ({ type: "func", name: "rotateX", args: d[2] }) %}
    | "rotateY" _ 1Args {% (d) => ({ type: "func", name: "rotateY", args: d[2] }) %}
    | "rotateZ" _ 1Args {% (d) => ({ type: "func", name: "rotateZ", args: d[2] }) %}
    | "scale" _ NArgs {% (d) => ({ type: "func", name: "scale", args: d[2] }) %}

ShapeFunctions -> 
    "box" _ 0Args {% (d) => ({ type: "func", name: "box", args: d[2] }) %}
    | "ball" _ 0Args {% (d) => ({ type: "func", name: "ball", args: d[2] }) %}

StyleFunctions -> 
    "rgb" _ NArgs {% (d) => ({ type: "func", name: "rgb", args: d[2] }) %}
    | "rgba" _ NArgs {% (d) => ({ type: "func", name: "rgba", args: d[2] }) %}
	| "hsl" _ NArgs {% (d) => ({ type: "func", name: "hsl", args: d[2] }) %}
    | "hsla" _ NArgs {% (d) => ({ type: "func", name: "hsla", args: d[2] }) %}

ExpressionList -> Expression {% (d) => [d[0]] %}
    | ExpressionList _ "," _ Expression {% (d) => [...d[0], d[4]] %}
    
NArgs -> "(" _ ")" {% () => ({ type: "arguments", value: [] }) %}
    | "(" _ ExpressionList _ ")" {% (d) => ({ type: "arguments", value: d[2] }) %}

0Args -> "(" _ ")" {% () => ({ type: "arguments", value: [] }) %}
1Args -> "(" _ Expression _ ")" {% (d) => ({ type: "arguments", value: [d[2]] }) %}
2Args -> "(" _ Expression _ "," _ Expression _ ")" {% (d) => ({ type: "arguments", value: [d[2], d[6]] }) %}
3Args -> "(" _ Expression _ "," _ Expression _ "," _ Expression _ ")" {% (d) => ({ type: "arguments", value: [d[2], d[6], d[10]] }) %}

Parenthesized -> "(" _ Expression _ ")" {% (d) => ({ type: "parenthesized", value: d[2] }) %}

Expression -> Binop {% id %}

Binop -> ExpOr {% id %}

ExpOr -> ExpOr _ "||" _ ExpAnd {% (d) => ({ type: "binary", left: d[0], right: d[4], operation: "||" }) %}
    | ExpAnd {% id %}
 
ExpAnd -> ExpAnd _ "&&" _ ExpComparison {% (d) => ({ type: "binary", left: d[0], right: d[4], operation: "&&" }) %}
    | ExpComparison {% id %}

ExpComparison ->
      ExpComparison _ %comparison _ ExpSum {% (d) => ({ type: "comparison", left: d[0], right: d[4], operation: d[2].text }) %}
    | ExpSum {% id %}
    
ExpSum ->
      ExpSum _ %sum _ ExpProduct {% (d) => ({ type: "sum", left: d[0], right: d[4], operation: d[2].text }) %}
    | ExpProduct {% id %}
 
ExpProduct ->
      ExpProduct _ %product _ Atom {% (d) => ({ type: "product", left: d[0], right: d[4], operation: d[2].text }) %}
    | Atom {% id %}

Atom -> Number {% id %}
  | String {% id %}
  | Var {% id %}
  | Parenthesized {% id %}
  | FunctionCalls {% id %}
  | Array {% id %}
  | Object {% id %}

# primatives

Array -> "[" _ "]" {% (d) => ({ type: "array", value: [] }) %}
	| "[" _ ExpressionList _ "]" {% (d) => ({ type: "array", value: d[2] }) %}

Object -> "{" _ "}" {% (d) => ({ type: "object", entries: [] }) %}
  | "{" _ ObjectEntryList _ "}" {% (d) => ({ type: "object", entries: d[2] }) %}

ObjectEntryList -> ObjectEntry {% (d) => [d[0]] %}
	| ObjectEntryList _ "," _ ObjectEntry {% (d) => [...d[0], d[4]] %}

ObjectEntry -> ObjectKey _ ":" _ Expression {% (d) => ({ type: "object_entry", key: d[0], value: d[4] }) %}

ObjectKey -> Name {% (d) => ({ type: "object_key", value: d[0] }) %}
   | String {% (d) => ({ type: "object_key", value: d[0] }) %}
   | "[" _ Expression _ "]" {% (d) => ({ type: "object_key", value: d[2] }) %}

Number -> %number {% (d) => ({ type: "number", value: d[0].value }) %}
String -> %string {% (d) => ({ type: "string", value: d[0].value }) %}

Name -> _name {% (d) => ({ type: "name", value: d[0] }) %}
 
_name -> %variableName {% (d) => d[0].value %}

_ -> null {% () => null %}
    | _ %ws  {% () => null %}
    | _ %nl  {% () => null %}

__ -> %ws            {% () => null %}
    | %nl            {% () => null %}
    | __ %ws        {% () => null %}
    | __ %nl        {% () => null %}