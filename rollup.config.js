import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.dev.js',
            format: 'iife',
            name: 'ElevenLabsCommunityGenUI',
            sourcemap: true
        },
        {
            file: 'dist/index.js',
            format: 'iife',
            name: 'ElevenLabsCommunityGenUI',
            plugins: [terser()],
        }
    ],
    plugins: [
        nodeResolve(),
        postcss({
            minimize: true,
            inject: true
        })
    ]
};
