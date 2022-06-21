import vitePluginRaw from 'vite-plugin-raw';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vitePluginRaw({
        match: /\.(glsl)$/
    })
  ]
})