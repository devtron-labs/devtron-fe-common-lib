// import peerDepsExternal from 'rollup-plugin-peer-deps-external'
// import resolve from '@rollup/plugin-node-resolve'
// import typescript from 'rollup-plugin-typescript2'
// import postcss from 'rollup-plugin-postcss'
// import { babel } from '@rollup/plugin-babel'
// import del from 'rollup-plugin-delete'
// import pkg from './package.json'
// import svgr from '@svgr/rollup'
// import url from '@rollup/plugin-url'

// export default {
//     input: './src/index.ts',
//     //output: [{ file: pkg.main, format: 'cjs' }],
//     output: { dir: 'dist', format: 'es' },
//     plugins: [
//         peerDepsExternal(),
//         resolve(),
//         typescript(),
//         postcss({
//             extensions: ['.css'],
//         }),
//         babel({
//             exclude: 'node_modules/**',
//         }),
//         del({ targets: ['dist/*'] }),
//         url({limit: '100000'}),
//         svgr({ icon: true })
//     ],
//     external: Object.keys(pkg.peerDependencies || {}),
// }
