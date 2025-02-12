import type { RenderManager } from "../gl/RenderManager";
import { parse } from "../parser/parser";
import { compileAST } from "./compileAST";

export type UserRenderFunction = (
  state: object,
  manager: RenderManager,
) => void;

export function createFunction(code: string): UserRenderFunction {
  const compiledCode = compileAST(parse(code));

  return Function("state", "manager", compiledCode) as UserRenderFunction;
}
