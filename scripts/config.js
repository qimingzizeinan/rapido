const path = require('path');
const ts = require('rollup-plugin-typescript2');
import json from '@rollup/plugin-json';

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
    plugins: [node(), cjs()],
    external: [],
  },
  fs: {
    entry: resolve('packages/fs/src/index.ts'),
    dest: resolve('packages/fs/dist/index.js'),
    format: 'cjs',
    banner,
    plugins: [node(), cjs()],
    external: [],
  },
  cli: {
    entry: resolve('packages/cli/src/index.ts'),
    dest: resolve('packages/cli/dist/index.js'),
    format: 'cjs',
    banner,
    plugins: [
      json(),
      cjs(),
      node({
        exportConditions: ['node'], // add node option here,
        // preferBuiltins: false,
      }),
    ],
    external: [],
  },
  utils: {
    entry: resolve('packages/utils/src/index.ts'),
    dest: resolve('packages/utils/dist/index.js'),
    format: 'cjs',
    banner,
    plugins: [node(), cjs()],
    external: [],
  },
};

function genConfig(name) {
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

  // console.log('pluging', config.plugins)

  //   // built-in vars
  //   const vars = {
  //     __VERSION__: version,
  //     __DEV__: `process.env.NODE_ENV !== 'production'`,
  //     __TEST__: false,
  //     __GLOBAL__: opts.format === 'umd' || name.includes('browser'),
  //   };

  //   config.plugins.push(replace(vars));

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
