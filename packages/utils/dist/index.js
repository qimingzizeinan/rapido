/*!
 * Rapido v2.0.0
 * (c) 2022-2022
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const chalk = require('chalk');
function log(content) {
    console.log(content);
}
/**
 * 拼接解析
 * @param {*} _path
 * @param {*} _file
 */
const resolvePath = (_path, _file) => path__default["default"].resolve(_path, _file);
/**
 * 获取时间
 * @returns 2020-6-19_00-00-00
 */
const getTime = function getTime() {
    const _Date = new Date();
    const date = _Date.toJSON().split('T')[0];
    const time = _Date.toTimeString().split(' ')[0].replace(/\:/g, '-');
    return `${date}_${time}`;
};
const step = text => console.log(chalk.bgCyan(chalk.black(text)));
const info = text => console.log(chalk.cyan(text));
const successInfo = text => console.log(chalk.green(text));
const errorInfo = text => console.log(chalk.red(text));

exports.errorInfo = errorInfo;
exports.getTime = getTime;
exports.info = info;
exports.log = log;
exports.resolvePath = resolvePath;
exports.step = step;
exports.successInfo = successInfo;
