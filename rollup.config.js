import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/cli.js',
  dest: 'dist/index.js',
  format: 'iife',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
}
