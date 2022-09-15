const execa = require('execa');
const path = require('path');
const configPath = path.join(__dirname, './', 'config.js');
const chalk = require('chalk');
const step = (msg) => console.log(chalk.cyan(msg));

async function cliPackage(type) {
  await execa('pnpm', [
    type,
    '@rapidoq/fs',
    '@rapidoq/shell',
    '--filter',
    '@rapidoq/cli',
  ]);
}

async function buildPackage(name) {
  await execa('rollup', ['-c', configPath, '--environment', `TARGET:${name}`]);
}

function padEnd(name) {
  return name.padEnd(9, ' ');
}

async function build(releasePackage) {
  if (releasePackage !== 'cli') {
    await step(`${padEnd(releasePackage)} package building...`);
    await buildPackage(releasePackage);
  } else {
    step(`${padEnd('cli')} remove dep...`);
    await cliPackage('uninstall');

    step(`${padEnd('cli')} install dep...`);
    await cliPackage('install');

    step(`${padEnd('cli')} package building...`);
    await buildPackage('cli');
  }
}

// build(['utils']);

module.exports = build;
