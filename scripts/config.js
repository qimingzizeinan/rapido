const path = require('path');
const ts = require('rollup-plugin-typescript2');
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const cjs = require('@rollup/plugin-commonjs');
const node = require('@rollup/plugin-node-resolve').nodeResolve;

const version = process.env.VERSION || require('../package.json').version;

const banner =
  '/*!\n' +
  ` * Rapido v${version}\n` +
  ` * (c) 2022-${new Date().getFullYear()}\n` +
  ' * Released under the MIT License.\n' +
  ' */';

const resolve = (p) => {
  return path.join(__dirname, '../', p);
};

const builds = {
  shell: {
    entry: resolve('packages/shell/src/index.ts'),
    dest: resolve('packages/shell/dist/index.js'),
    format: 'cjs',
    banner,
    plugins: [cjs()],
    external: [],
  },
  fs: {
    entry: resolve('packages/fs/src/index.ts'),
    dest: resolve('packages/fs/dist/index.js'),
    format: 'cjs',
    banner,
    plugins: [
      cjs(),
      // node({
      //   exportConditions: ['node'], // add node option here,
      //   preferBuiltins: false,
      // }),
      json(),
    ],
    external: ['node-ssh'],
  },
  cli: {
    entry: resolve('packages/cli/src/index.ts'),
    dest: resolve('packages/cli/dist/index.js'),
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    plugins: [
      json(),
      cjs(),
      // node({
      //   exportConditions: ['node'], // add node option here,
      //   // preferBuiltins: false,
      // }),
    ],
    external: ['node-ssh'],
  },
  utils: {
    entry: resolve('packages/utils/src/index.ts'),
    dest: resolve('packages/utils/dist/index.js'),
    format: 'cjs',
    banner,
    plugins: [
      commonjs(),
      json(),
      cjs(),
      babel({
        exclude: 'node_modules/**', // 只编译我们的源代码
      }),
      // node({
      //   exportConditions: ['node'], // add node option here,
      //   preferBuiltins: false,
      // }),
    ],
    external: ['node'],
  },
};

function genConfig(name) {
  console.log('name', name);
  const opts = builds[name];
  // console.log('opts', opts);
  // return;

  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      ts({
        tsconfig: path.resolve(
          __dirname,
          '../',
          `packages/${name}/tsconfig.json`
        ),
        // cacheRoot: path.resolve(__dirname, '../', 'node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: {
            // if targeting browser, target es5
            // if targeting node, es2017 means Node 8
            target:
              opts.transpile === false || opts.format === 'cjs'
                ? 'es2017'
                : 'es5',
          },
          exclude: ['test', 'test-dts'],
        },
      }),
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Rapido',
      exports: 'auto',
    },
    external: opts.external,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
  };

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name,
  });

  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  console.error('请在package.json的script指定Target');
}
