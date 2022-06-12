import type { Statement, Block, FunctionCall, Arguments, Expression, Assignment, Var, Operation, IfStatement, NamedVariable } from "../parser/ast";

export function compileAST(block: Block) : string {
    return compileBlock(block);
}

function compileBlock(block: Block) : string {
    return block.statements.map(compileStatement).join("\n");
}

function compileStatement(statement: Statement) : string {
    switch (statement.type) {
        case "func":
            return compileFunctionCall(statement);
        case "assignment":
            return compileAssignment(statement);
        case "if":
            return compileIfStatment(statement);
    }
}

function compileIfStatment(ifStatement: IfStatement) : string {
    const start = `if (${compileExpression(ifStatement.condition)}) {\n${compileBlock(ifStatement.then)}\n}`;
    if(!ifStatement.else) {
        return start;
    }
    if(ifStatement.else.type === "block") {
        return start + ` else {\n${compileBlock(ifStatement.else)}\n}`
    } else {
        return start + ` else${compileIfStatment(ifStatement.else)}`
    }
}

function compileFunctionCall(functionCall: FunctionCall) : string {
    const mathFunctions = ["cos", "sin"];

    const funcName = functionCall.name;

    if(mathFunctions.includes(funcName)) {
        return `Math.${funcName}(${compileArguments(functionCall.args)})`
    }
    throw new Error(`Unknown function: ${funcName}`);
}

function compileArguments(args: Arguments) : string {
    return args.value.map(compileExpression).join(", ");
}

function compileAssignment(assignment: Assignment) : string {
    return `${compileVar(assignment.set)} = ${compileExpression(assignment.to)}`
}

const constants: Record<string, string> = {
    "true": "true",
    "false": "false",
    "null": "null",
    "pi": "Math.PI"
};

function isAConstant(variable: Var) : boolean {
    if(variable.type === "variable") {
        return variable.name.value.toLowerCase() in constants;
    }
    return false;
}

function getConstant(variable: NamedVariable) : string {
    return constants[variable.name.value.toLowerCase()];
}

function compileVar(variable: Var) : string {
    

    switch(variable.type) {
        case "variable":
            if(isAConstant(variable)) {
                return getConstant(variable)
            }
            return `state['${variable.name.value}']`;
        case "key_access":
            if(isAConstant(variable.from)) {
                throw new Error("Cannot access key of constant");
            }
            if(variable.key.type === "name") {
                return `${compileVar(variable.from)}['${variable.key.value}']`;
            } else {
                return `${compileVar(variable.from)}[${compileExpression(variable.key)}]`;
            }
    }
}

function compileExpression(expression: Expression) : string {
    switch(expression.type) {
        case "number":
        case "string":
            return expression.value;
        case "key_access":
        case "variable":
            return compileVar(expression);
        case "product":
        case "sum":
        case "comparison":
        case "binary":
            return compileOperation(expression);
        case "func":
            return compileFunctionCall(expression);
        case "parenthesized": 
            return `(${compileExpression(expression.value)})`
    }
}

function compileOperation<Op extends string, Left extends Expression, Right extends Expression>(operation: Operation<Op, Left, Right>) : string {
    return `${compileExpression(operation.left)} ${operation.operation} ${compileExpression(operation.right)}`
}