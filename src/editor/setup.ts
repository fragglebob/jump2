import * as monaco from "monaco-editor";
import { starterCode } from "../starterCode";
import { setupLanguage } from "./language";
import { setupTheme } from "./theme";
import "./worker";

export function setup() : monaco.editor.IStandaloneCodeEditor  {
  const element = document.getElementById("code2");

  if (!element) {
    throw new Error("Could not find element to bind editor to");
  }

  setupLanguage();
  setupTheme();

  return monaco.editor.create(element, {
    value: starterCode,
    language: "jump",
    theme: "myTheme",
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    lineNumbers: "off",
    folding: false,
  });
}
