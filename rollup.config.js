import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import del from 'rollup-plugin-delete'
import pkg from './package.json'
import svgr from '@svgr/rollup';
import url from '@rollup/plugin-url'

export default {
    input: './src/index.ts',
    output: [{ file: pkg.main, format: 'es' }],
    plugins: [
        peerDepsExternal(),
        resolve(),
        typescript(),
        postcss({
            extensions: ['.css'],
        }),
        terser(),
        babel({
            exclude: 'node_modules/**',
        }),
        del({ targets: ['dist/*'] }),
        url(),
        svgr()
    ],
    external: Object.keys(pkg.peerDependencies || {}),
}
