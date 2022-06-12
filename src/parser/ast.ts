export interface ASTItem {
    type: string;
}

export interface BasicASTItem<Value> {
    value: Value;
}

export interface Block extends ASTItem {
    type: "block";
    statements: Statement[]
}

export type Statement = IfStatement | FunctionCall | Assignment;

export interface IfStatement extends ASTItem {
    type: "if"
    condition: Expression;
    then: Block;
    else: Block | IfStatement | null;
}

export interface FunctionCall extends ASTItem {
    type: "func"
    name: string;
    args: Arguments;
}

export interface Arguments extends BasicASTItem<Expression[]> {
    type: "arguments";
}

export interface Assignment extends ASTItem {
    type: "assignment";
    set: Var;
    to: Expression
}

export type Var = NamedVariable | KeyAccess;

export interface NamedVariable extends ASTItem {
    type: "variable";
    name: Name;
}

export interface KeyAccess extends ASTItem {
    type: "key_access";
    key: Expression | Name;
    from: Var;
}

export interface Name extends BasicASTItem<string> {
    type: "name";
}

export type Expression = OrBinaryOp | AndBinaryOp | ComparisonOp | SumOp | ProductOp | Atom;

export interface Operation<Op extends string, Left extends Expression, Right extends Expression> {
    operation: Op
    left: Left,
    right: Right,
}

export interface OrBinaryOp extends Operation<"or", Expression, Expression> {
    type: "binary"
}

export interface AndBinaryOp extends Operation<"and", Expression, Expression> {
    type: "binary"
}

export interface ComparisonOp extends Operation<">=" | ">" | "<=" | "<" | "==" | "!=", Expression, Expression> {
    type: "comparison"
}

export interface SumOp extends Operation<"+" | "-", Expression, Expression> {
    type: "sum"
}

export interface ProductOp extends Operation<"*" | "/" | "%", Expression, Expression> {
    type: "product"
}

export type Atom = String | Number | FunctionCall | Parenthesized | Var;

export interface String extends BasicASTItem<string> {
    type: "string"
}

export interface Number extends BasicASTItem<string> {
    type: "number"
}

export interface Parenthesized extends BasicASTItem<Expression> {
    type: "parenthesized"
}