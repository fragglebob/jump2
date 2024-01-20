import vitePluginRaw from 'vite-plugin-raw';
import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  plugins: [
    vitePluginRaw({
        match: /\.(glsl)$/
    })
  ],
})