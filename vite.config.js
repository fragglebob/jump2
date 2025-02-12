import { defineConfig } from "vite";
import vitePluginRaw from "vite-plugin-raw";

export default defineConfig({
  base: "",
  plugins: [
    vitePluginRaw({
      match: /\.(glsl)$/,
    }),
  ],
});
