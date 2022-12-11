import * as monaco from "monaco-editor";


export function setupLanguage() {

  monaco.languages.register({
    id: 'jump',
  });

  monaco.languages.setMonarchTokensProvider('jump', {
    keywords: ["loop", "times", "endloop", "if", "else", "then", "elseif", "endif", "while", "endwhile", "for", "endfor", "in"],
    fx_function: ["fx_kale", "fx_grid", "fx_rgb", "fx_bloom", "fx_feedback", "fx_warp"],
    maths_function: ["sin", "cos", "log", "round", "floor", "ceil", "min", "max", "pow", "sqrt"],
    world_functions: ["translate", "rotateX", "rotateY", "rotateZ", "scale", "pushMatrix", "popMatrix"],
    shape_functions: ["ball", "box"],
    util_functions: ["time", "frame", "fft", ""],
    style_functions: ["rgb", "rgba", "hsl", "hsla"],
    operators: [
      "+",
      "-",
      "*",
      "/",
      "%",
      "==",
      "<=",
      ">=",
      "<",
      ">",
      "=",     
      ",",
    ],
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/i, {
          cases: {
            '@keywords': { token: "keyword.$0" },
            '@fx_function': { token: "jump.func.fx" },
            '@maths_function': { token: "jump.func.maths" },
            '@world_functions': { token: "jump.func.world" },
            '@shape_functions': { token: "jump.func.shape" },
            '@util_functions': { token: "jump.func.util" },
            '@style_functions': { token: "jump.func.style" },
            '@default': 'identifier'
          }
        }],
        { include: '@whitespace' },
        [/\d*\.\d+/, "number"],
        [/\d+?/, "number"],
      ],
      whitespace: [
        [/\s+/, 'white'],
      ]
    }
  });

}