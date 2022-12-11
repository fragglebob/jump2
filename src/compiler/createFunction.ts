import { RenderManager } from "../gl/RenderManager";
import { NearlyParser, parse } from "../parser/parser";
import { compileAST } from "./compileAST";

export type UserRenderFunction = (state: object, manager: RenderManager) => void;

export function createFunction(parser: NearlyParser, code: string) : UserRenderFunction {
    const compiledCode = compileAST(parse(parser, code));

    return Function("state", "manager", compiledCode) as UserRenderFunction;
}