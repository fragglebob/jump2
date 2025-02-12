import type {
  ASTItem,
  Arguments,
  ArrayASTItem,
  Assignment,
  Block,
  Expression,
  ForinStatement,
  FunctionCall,
  IfStatement,
  LoopStatement,
  NamedVariable,
  ObjectASTItem,
  ObjectKeyASTItem,
  Operation,
  Range,
  Statement,
  Var,
  WhileStatement,
} from "../parser/ast";

function unhandledError(type: string, item: ASTItem): never {
  throw new Error(`Unhandled ${type}: ${item.type}`);
}

class Context {
  readonly depth: number;
  constructor({ depth }: { depth: number }) {
    this.depth = depth;
  }

  indent(): Context {
    return new Context({ depth: this.depth + 1 });
  }

  public get whitespace(): string {
    return " ".repeat(this.depth * 2);
  }

  static start(): Context {
    return new Context({ depth: 0 });
  }
}

export function compileAST(block: Block): string {
  return compileBlock(Context.start(), block);
}

function compileBlock(ctx: Context, block: Block): string {
  return block.statements
    .map((value) => ctx.whitespace + compileStatement(ctx, value))
    .join("\n");
}

function compileStatement(ctx: Context, statement: Statement): string {
  switch (statement.type) {
    case "func":
      return compileFunctionCall(ctx, statement);
    case "assignment":
      return compileAssignment(ctx, statement);
    case "if":
      return compileIfStatment(ctx, statement);
    case "loop":
      return compileLoopStatment(ctx, statement);
    case "while":
      return compileWhileStatment(ctx, statement);
    case "forin":
      return compileForinStatement(ctx, statement);
  }
  unhandledError("statement", statement);
}

function compileForinStatement(
  ctx: Context,
  statement: ForinStatement,
): string {
  const block = `{\n${compileBlock(ctx.indent(), statement.then)}\n${ctx.whitespace}}`;
  switch (statement.over.type) {
    case "range":
      return `${complieRangeFor(ctx, statement.over, statement.setting)} ${block}`;
    case "array":
      return `${complieArrayForof(ctx, statement.over, statement.setting)} ${block}`;
    case "key_access":
    case "variable":
      return `${complieVarForof(ctx, statement.over, statement.setting)} ${block}`;
    case "func":
      return `${complieFunctionForof(ctx, statement.over, statement.setting)} ${block}`;
  }
  unhandledError("forin over", statement.over);
}

function complieRangeFor(
  ctx: Context,
  range: Range,
  settingVariable: NamedVariable,
): string {
  const varName = compileVar(ctx, settingVariable);
  const startingValue = Number.parseFloat(range.from.value);
  const endingValue = Number.parseFloat(range.to.value);
  const operator = startingValue <= endingValue ? "<" : ">";
  const direction = startingValue <= endingValue ? "++" : "--";
  return `for (${varName} = ${startingValue}; ${varName} ${operator} ${endingValue}; ${varName}${direction})`;
}

function complieArrayForof(
  ctx: Context,
  array: ArrayASTItem,
  settingVariable: NamedVariable,
): string {
  const varName = compileVar(ctx, settingVariable);
  return `for (${varName} of ${compileArray(ctx, array)})`;
}

function complieFunctionForof(
  ctx: Context,
  func: FunctionCall,
  settingVariable: NamedVariable,
): string {
  const varName = compileVar(ctx, settingVariable);
  return `for (${varName} of ${compileFunctionCall(ctx, func)})`;
}

function complieVarForof(
  ctx: Context,
  variable: Var,
  settingVariable: NamedVariable,
): string {
  const varName = compileVar(ctx, settingVariable);
  return `for (${varName} of ${compileVar(ctx, variable)})`;
}

function compileLoopStatment(ctx: Context, statement: LoopStatement): string {
  if (!statement.setting) {
    return `for (let i = 0; i < ${compileExpression(
      ctx,
      statement.times,
    )}; i++) {\n${compileBlock(ctx.indent(), statement.then)}\n${
      ctx.whitespace
    }}`;
  }
  return `for (${compileVar(ctx, statement.setting)} = 0; ${compileVar(
    ctx,
    statement.setting,
  )} < ${compileExpression(ctx, statement.times)}; ${compileVar(
    ctx,
    statement.setting,
  )}++) {\n${compileBlock(ctx.indent(), statement.then)}\n${ctx.whitespace}}`;
}

function compileWhileStatment(ctx: Context, statement: WhileStatement): string {
  return `while (${compileExpression(
    ctx,
    statement.condition,
  )} {\n${compileBlock(ctx.indent(), statement.then)}\n${ctx.whitespace}}`;
}

function compileIfStatment(ctx: Context, ifStatement: IfStatement): string {
  const start = `if (${compileExpression(
    ctx,
    ifStatement.condition,
  )}) {\n${compileBlock(ctx.indent(), ifStatement.then)}\n${ctx.whitespace}}`;
  if (!ifStatement.else) {
    return start;
  }
  if (ifStatement.else.type === "block") {
    return `${start} else {\n${compileBlock(ctx.indent(), ifStatement.else)}\n${
      ctx.whitespace
    }}`;
  }

  return `${start} else${compileIfStatment(ctx, ifStatement.else)}`;
}

function compileFunctionCall(ctx: Context, functionCall: FunctionCall): string {
  const funcName = functionCall.name;

  switch (funcName) {
    case "sin":
    case "cos":
    case "log":
    case "round":
    case "floor":
    case "ceil":
    case "pow":
    case "sqrt":
    case "min":
    case "max":
      return `Math.${funcName}(${compileArguments(ctx, functionCall.args)})`;
    case "popMatrix":
    case "pushMatrix":
    case "translate":
    case "rotateX":
    case "rotateY":
    case "rotateZ":
    case "scale":
    case "box":
    case "ball":
    case "rgb":
    case "rgba":
    case "hsl":
    case "hsla":
    case "time":
    case "frame":
    case "beat":
    case "bar":
    case "beat_progress":
    case "bar_progress":
    case "beat_raw":
    case "fft":
    case "slider":
    case "knob":
    case "fx_kale":
    case "fx_grid":
    case "fx_px":
    case "fx_rgb":
    case "fx_bloom":
    case "fx_feedback":
    case "fx_warp":
    case "fx_ascii":
      return `manager.${funcName}(${compileArguments(ctx, functionCall.args)})`;
  }

  throw new Error(`Unknown function: ${funcName}`);
}

function compileArguments(ctx: Context, args: Arguments): string {
  return args.value.map((value) => compileExpression(ctx, value)).join(", ");
}

function compileAssignment(ctx: Context, assignment: Assignment): string {
  return `${compileVar(ctx, assignment.set)} = ${compileExpression(
    ctx,
    assignment.to,
  )}`;
}

const constants: Record<string, string> = {
  true: "true",
  false: "false",
  null: "null",
  pi: "Math.PI",
};

function isAConstant(ctx: Context, variable: Var): boolean {
  if (variable.type === "variable") {
    return variable.name.value.toLowerCase() in constants;
  }
  return false;
}

function getConstant(ctx: Context, variable: NamedVariable): string {
  return constants[variable.name.value.toLowerCase()];
}

function compileVar(ctx: Context, variable: Var): string {
  switch (variable.type) {
    case "variable":
      if (isAConstant(ctx, variable)) {
        return getConstant(ctx, variable);
      }
      return `state['${variable.name.value}']`;
    case "key_access":
      if (isAConstant(ctx, variable.from)) {
        throw new Error("Cannot access key of constant");
      }
      if (variable.key.type === "name") {
        return `${compileVar(ctx, variable.from)}['${variable.key.value}']`;
      }
      return `${compileVar(ctx, variable.from)}[${compileExpression(
        ctx,
        variable.key,
      )}]`;
  }
  unhandledError("var", variable);
}

function compileExpression(ctx: Context, expression: Expression): string {
  switch (expression.type) {
    case "number":
    case "string":
      return expression.value;
    case "array":
      return compileArray(ctx, expression);
    case "object":
      return compileObject(ctx, expression);
    case "key_access":
    case "variable":
      return compileVar(ctx, expression);
    case "product":
    case "sum":
    case "comparison":
    case "binary":
      return compileOperation(ctx, expression);
    case "func":
      return compileFunctionCall(ctx, expression);
    case "parenthesized":
      return `(${compileExpression(ctx, expression.value)})`;
  }
  unhandledError("expression", expression);
}

function compileOperation<
  Op extends string,
  Left extends Expression,
  Right extends Expression,
>(ctx: Context, operation: Operation<Op, Left, Right>): string {
  return `${compileExpression(ctx, operation.left)} ${
    operation.operation
  } ${compileExpression(ctx, operation.right)}`;
}

function compileArray(ctx: Context, array: ArrayASTItem): string {
  if (array.value.length === 0) {
    return "[]";
  }
  const indented = ctx.indent();
  return `[\n${array.value
    .map((value) => indented.whitespace + compileExpression(indented, value))
    .join(",\n")}\n${ctx.whitespace}]`;
}

function compileObject(ctx: Context, object: ObjectASTItem): string {
  if (object.entries.length === 0) {
    return "{}";
  }
  const indented = ctx.indent();
  const entries = object.entries
    .map((entry) => {
      return `${indented.whitespace}${complieObjectKey(
        ctx,
        entry.key,
      )}: ${compileExpression(indented, entry.value)}`;
    })
    .join(",\n");

  return `{\n${entries}\n${ctx.whitespace}}`;
}

function complieObjectKey(ctx: Context, objectKey: ObjectKeyASTItem): string {
  switch (objectKey.value.type) {
    case "name":
      return objectKey.value.value;
    case "string":
      return objectKey.value.value;
    default:
      return `[${compileExpression(ctx, objectKey.value)}]`;
  }
}
