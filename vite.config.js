import vitePluginRaw from 'vite-plugin-raw';
import { defineConfig } from 'vite'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  base: '',
  plugins: [
    viteCommonjs(),
    vitePluginRaw({
        match: /\.(glsl)$/
    })
  ]
})