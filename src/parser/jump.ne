@preprocessor typescript

@{%
    // Moo lexer documention is here:
    // https://github.com/no-context/moo

    import moo from "moo";
    const lexer = moo.compile({
        ws:     /[ \t]+/,
        number:  [
            { match: /(?:-?(?:0|[1-9][0-9]*)?\.[0-9]+)/ },  // [123].123
            { match: /(?:-?(?:0|[1-9][0-9]*)\.[0-9]*)/ },   // 123.[123]
            { match: /(?:0|-?[1-9][0-9]*)/ },               // 123
        ],
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
    
    
    
    
    
    
#Else -> "endif" {% () => null %}
#    | "else" __ Block __ "endif" {% (d) => d[2] %}
#    | ElseIf __ "else" __ Block __ "endif" {% (d) => { d[0].else = d[4]; return d[0]; } %}
 
#ElseIf -> "elseif" __ Expression __ "then" __ Block {% (d) => ({ type: "if", condition: d[2], then: d[6] }) %}
#  | ElseIf __ "elseif" __ Expression __ "then" __ Block {% d => `${d[0]} } else if (${d[4]}) { ${d[8]}` %}


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
    "fx_kale" _ Args {% (d) => ({ type: "func", name: "fx_kale", args: d[2] }) %}
    | "fx_grid" _ Args {% (d) => ({ type: "func", name: "fx_grid", args: d[2] }) %}

MathsFunctions -> 
    "sin" _ Args {% (d) => ({ type: "func", name: "sin", args: d[2] }) %}
    | "cos" _ Args {% (d) => ({ type: "func", name: "cos", args: d[2] }) %}

UtilFunctions ->
    "time" _ Args {% (d) => ({ type: "func", name: "time", args: d[2] }) %} |
    "frame" _ Args {% (d) => ({ type: "func", name: "frame", args: d[2] }) %} | 
    "fft" _ Args {% (d) => ({ type: "func", name: "fft", args: d[2] }) %}

WorldFunctions -> 
    "pushMatrix" _ Args {% (d) => ({ type: "func", name: "pushMatrix", args: d[2] }) %}
    | "popMatrix" _ Args {% (d) => ({ type: "func", name: "popMatrix", args: d[2] }) %}
    | "translate" _ Args {% (d) => ({ type: "func", name: "translate", args: d[2] }) %}
    | "rotateX" _ Args {% (d) => ({ type: "func", name: "rotateX", args: d[2] }) %}
    | "rotateY" _ Args {% (d) => ({ type: "func", name: "rotateY", args: d[2] }) %}
    | "rotateZ" _ Args {% (d) => ({ type: "func", name: "rotateZ", args: d[2] }) %}
    | "scale" _ Args {% (d) => ({ type: "func", name: "scale", args: d[2] }) %}

ShapeFunctions -> 
    "box" _ Args {% (d) => ({ type: "func", name: "box", args: d[2] }) %}
    | "ball" _ Args {% (d) => ({ type: "func", name: "ball", args: d[2] }) %}

StyleFunctions -> 
    "rgb" _ Args {% (d) => ({ type: "func", name: "rgb", args: d[2] }) %}
    | "rgba" _ Args {% (d) => ({ type: "func", name: "rgba", args: d[2] }) %}
	| "hsl" _ Args {% (d) => ({ type: "func", name: "hsl", args: d[2] }) %}
    | "hsla" _ Args {% (d) => ({ type: "func", name: "hsla", args: d[2] }) %}

ExpressionList -> Expression {% (d) => [d[0]] %}
    | ExpressionList _ "," _ Expression {% (d) => [...d[0], d[4]] %}
    
Args -> "(" _ ")" {% () => ({ type: "arguments", value: [] }) %}
    | "(" _ ExpressionList _ ")" {% (d) => ({ type: "arguments", value: d[2] }) %}

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