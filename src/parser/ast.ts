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

export type Statement = IfStatement | FunctionCall | Assignment | WhileStatement | LoopStatement | ForinStatement;

export interface IfStatement extends ASTItem {
    type: "if"
    condition: Expression;
    then: Block;
    else: Block | IfStatement | null;
}

export interface WhileStatement extends ASTItem {
    type: "while"
    condition: Expression;
    then: Block;
}

export interface LoopStatement extends ASTItem {
    type: "loop"
    times: Expression;
    then: Block;
    setting?: NamedVariable;
}

export interface ForinStatement extends ASTItem {
    type: "forin"
    over: Iterable;
    then: Block;
    setting: NamedVariable;
}

export type Iterable = Range | ArrayASTItem | FunctionCall | Var;

export interface Range extends ASTItem {
    type: "range"
    from: NumberASTItem
    to: NumberASTItem
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

export type Atom = ObjectASTItem | ArrayASTItem | StringASTItem | NumberASTItem | FunctionCall | Parenthesized | Var;

export interface ArrayASTItem extends BasicASTItem<Expression[]> {
    type: "array"
}

export interface StringASTItem extends BasicASTItem<string> {
    type: "string"
}

export interface NumberASTItem extends BasicASTItem<string> {
    type: "number"
}

export interface Parenthesized extends BasicASTItem<Expression> {
    type: "parenthesized"
}

export interface ObjectASTItem extends ASTItem {
    type: "object"
    entries: ObjectEntryASTItem[]
}

export interface ObjectEntryASTItem extends ASTItem {
    type: "object_entry"
    key: ObjectKeyASTItem
    value: Expression
}

export interface ObjectKeyASTItem extends BasicASTItem<Name | StringASTItem | Expression> {
    type: "object_key"
}