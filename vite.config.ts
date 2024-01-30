import { defineConfig } from 'vite'
import { extname, relative, resolve } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import svgr from 'vite-plugin-svgr'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import * as packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    svgr({
      svgrOptions: {}
    }),
    dts(),
    NodeGlobalsPolyfillPlugin({
      process: true,
  })
  ],
  build: {
    target: "ES2021",
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob.sync('src/**/!(*.d).{ts,tsx}').map(file => [
          // 1. The name of the entry point
          // lib/nested/foo.js becomes nested/foo
          relative(
            'src',
            file.slice(0, file.length - extname(file).length)
          ),
          // 2. The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    }
  }
})


