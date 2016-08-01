import babel from 'rollup-plugin-babel'
// import commonjs from 'rollup-plugin-commonjs'
// import nodeResolve from 'rollup-plugin-node-resolve'
// import json from 'rollup-plugin-json'

export default {
  entry: 'src/cli.js',
  dest: 'dist/index.js',
  format: 'iife',
  banner: '#!/usr/bin/env node',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
    // nodeResolve({
    //   jsnext: true,
    //   main: true
    // }),
    // commonjs({
    //   include: 'node_modules/**'
    // }),
    // json({
    //   include: 'node_modules/**'
    // })
  ]
}
