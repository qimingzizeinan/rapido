/*!
 * Rapido v2.0.0
 * (c) 2022-2022
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var execa = require('execa');
var utils = require('@rapidoq/utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);

const defaults = {
    cwd: process.cwd(),
};
/**
 * 切换工作目录
 * @param cwd
 *
 */
async function cd(cwd) {
    defaults.cwd = cwd;
}
/**
 * 获取执行目录
 */
function pwd() {
    return process.cwd();
}
async function cmd(cmd, options) {
    return await execa__default["default"].commandSync(cmd, Object.assign(Object.assign({}, defaults), options));
}
const rexec = execa__default["default"];

/**
 * 获取git 状态
 * @returns
 */
async function getGitStatus() {
    try {
        return await cmd('git status');
    }
    catch (error) { }
}
/**
 * 获取git 分支
 * @returns
 */
async function getGitBranch() {
    return await cmd('git branch');
}
/**
 * git push
 */
async function gitPush() {
    try {
        return await cmd('git push');
    }
    catch (error) {
        utils.log(error.stderr);
    }
}
/**
 * 获取git 分支列表
 */
async function getGitBranchList() {
    const result = await getGitBranch();
    if (result) {
        const splitList = result.stdout.split('\n').map((item) => {
            return item.replace(',', '').trim();
        });
        return splitList.filter((item) => item);
    }
}
/**
 * 获取git 当前分支
 */
async function getGitCurrentBranch() {
    const branchList = await getGitBranchList();
    if (branchList) {
        let currentBranch = '';
        branchList.forEach((item) => {
            if (item.includes('*')) {
                currentBranch = item;
            }
        });
        return currentBranch;
    }
}
/**
 * git add
 */
async function gitAddAll() {
    try {
        const { stdout } = await cmd('git add .');
        return stdout;
    }
    catch (error) {
        utils.log(error.stderr);
    }
}
/**
 * git commit
 */
async function gitCommit(info) {
    try {
        const { stdout } = await cmd(`git commit -m "${info}"`);
        return stdout;
    }
    catch (error) {
        utils.log(error.stderr);
    }
}
/**
 * 切换git 分支
 * @param branchName
 * @returns
 */
async function switchGitBranch(branchName) {
    try {
        const result = await cmd(`git checkout ${branchName}`);
        return result.stdout || result.stderr;
    }
    catch (error) {
        utils.log(error.stderr);
    }
}

/**
 * 判断是否安装了包
 * */
function isInstalled(name) {
    try {
        require.resolve(name);
        return true;
    }
    catch (e) {
        return false;
    }
}
function getInstallpara(manerger) {
    switch (manerger) {
        case 'npm':
        case 'pnpm':
            return 'install';
        case 'yarn':
            return 'add';
    }
}
function getUnInstallpara(manerger) {
    switch (manerger) {
        case 'npm':
        case 'pnpm':
            return 'uninstall';
        case 'yarn':
            return 'remove';
    }
}
/**
 * npm 安装包
 */
async function installDep(name, { manerger = 'npm', g = false, dev = false, } = {}) {
    try {
        const { stdout, stderr } = await cmd(`${manerger} ${getInstallpara(manerger)} ${name} ${dev ? '-D' : ''} ${g ? '-g' : ''}`);
        if (stdout) {
            return true;
        }
        else {
            utils.log(stderr);
        }
    }
    catch (error) {
        utils.log(error.stderr);
    }
}
/**
 * npm 卸载包
 */
async function uninstallDep(name, { manerger = 'npm', g = false, } = {}) {
    try {
        const { stdout, stderr } = await cmd(`${manerger} ${getUnInstallpara(manerger)} ${name} ${g ? '-g' : ''}`);
        if (stdout) {
            return true;
        }
        else {
            utils.log(stderr);
        }
    }
    catch (error) {
        utils.log(error.stderr);
    }
}

exports.cd = cd;
exports.cmd = cmd;
exports.getGitBranch = getGitBranch;
exports.getGitBranchList = getGitBranchList;
exports.getGitCurrentBranch = getGitCurrentBranch;
exports.getGitStatus = getGitStatus;
exports.gitAddAll = gitAddAll;
exports.gitCommit = gitCommit;
exports.gitPush = gitPush;
exports.installDep = installDep;
exports.isInstalled = isInstalled;
exports.pwd = pwd;
exports.rexec = rexec;
exports.switchGitBranch = switchGitBranch;
exports.uninstallDep = uninstallDep;
