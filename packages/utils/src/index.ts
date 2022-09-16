'use strict';

import path from 'path';
import chalk from 'chalk';

export function log(content: string) {
  console.log(content);
}

/**
 * 拼接解析
 * @param {*} _path
 * @param {*} _file
 */
export const resolvePath = (_path, _file) => path.resolve(_path, _file);

/**
 * 获取时间
 * @returns 2020-6-19_00-00-00
 */
export const getTime = function getTime() {
  const _Date = new Date();
  const date = _Date.toJSON().split('T')[0];
  const time = _Date.toTimeString().split(' ')[0].replace(/\:/g, '-');
  return `${date}_${time}`;
};

export const step = (text) => console.log(chalk.bgCyan(chalk.black(text)));

export const info = (text) => console.log(chalk.cyan(text));
export const successInfo = (text) => console.log(chalk.green(text));
export const errorInfo = (text) => console.log(chalk.red(text));
