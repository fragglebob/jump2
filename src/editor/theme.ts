import * as monaco from "monaco-editor";

export function setupTheme() {
  monaco.editor.defineTheme("myTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "jump.func.fx", foreground: "#eeff00" },
      { token: "jump.func.maths", foreground: "#1155ee" },
      { token: "jump.func.world", foreground: "#55dd00" },
      { token: "jump.func.shape", foreground: "#eeaa33" },
      { token: "jump.func.util", foreground: "#ee11ee" },
      { token: "jump.func.style", foreground: "#11eeaa" }
    ],
    colors: {
      "editor.background": "#00000000",
    },
  });
}