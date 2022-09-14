/*!
 * Rapido vundefined
 * (c) 2022-2022
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var child_process = require('child_process');

const defaults = {
    cwd: process.cwd(),
    env: process.env,
    windowsHide: true,
    shell: true,
};
function config() { }
/**
 * 切换工作目录
 * @param cwd
 *
 */
function cd(cwd) {
    process.chdir(cwd);
    defaults.cwd = cwd;
}
function errnoMessage(errno) {
    if (errno === undefined) {
        return 'Unknown error';
    }
    return ({
        0: 'Success',
        1: 'Not super-user',
        2: 'No such file or directory',
        3: 'No such process',
        4: 'Interrupted system call',
        5: 'I/O error',
        6: 'No such device or address',
        7: 'Arg list too long',
        8: 'Exec format error',
        9: 'Bad file number',
        10: 'No children',
        11: 'No more processes',
        12: 'Not enough core',
        13: 'Permission denied',
        14: 'Bad address',
        15: 'Block device required',
        16: 'Mount device busy',
        17: 'File exists',
        18: 'Cross-device link',
        19: 'No such device',
        20: 'Not a directory',
        21: 'Is a directory',
        22: 'Invalid argument',
        23: 'Too many open files in system',
        24: 'Too many open files',
        25: 'Not a typewriter',
        26: 'Text file busy',
        27: 'File too large',
        28: 'No space left on device',
        29: 'Illegal seek',
        30: 'Read only file system',
        31: 'Too many links',
        32: 'Broken pipe',
        33: 'Math arg out of domain of func',
        34: 'Math result not representable',
        35: 'File locking deadlock error',
        36: 'File or path name too long',
        37: 'No record locks available',
        38: 'Function not implemented',
        39: 'Directory not empty',
        40: 'Too many symbolic links',
        42: 'No message of desired type',
        43: 'Identifier removed',
        44: 'Channel number out of range',
        45: 'Level 2 not synchronized',
        46: 'Level 3 halted',
        47: 'Level 3 reset',
        48: 'Link number out of range',
        49: 'Protocol driver not attached',
        50: 'No CSI structure available',
        51: 'Level 2 halted',
        52: 'Invalid exchange',
        53: 'Invalid request descriptor',
        54: 'Exchange full',
        55: 'No anode',
        56: 'Invalid request code',
        57: 'Invalid slot',
        59: 'Bad font file fmt',
        60: 'Device not a stream',
        61: 'No data (for no delay io)',
        62: 'Timer expired',
        63: 'Out of streams resources',
        64: 'Machine is not on the network',
        65: 'Package not installed',
        66: 'The object is remote',
        67: 'The link has been severed',
        68: 'Advertise error',
        69: 'Srmount error',
        70: 'Communication error on send',
        71: 'Protocol error',
        72: 'Multihop attempted',
        73: 'Cross mount point (not really error)',
        74: 'Trying to read unreadable message',
        75: 'Value too large for defined data type',
        76: 'Given log. name not unique',
        77: 'f.d. invalid for this operation',
        78: 'Remote address changed',
        79: 'Can   access a needed shared lib',
        80: 'Accessing a corrupted shared lib',
        81: '.lib section in a.out corrupted',
        82: 'Attempting to link in too many libs',
        83: 'Attempting to exec a shared library',
        84: 'Illegal byte sequence',
        86: 'Streams pipe error',
        87: 'Too many users',
        88: 'Socket operation on non-socket',
        89: 'Destination address required',
        90: 'Message too long',
        91: 'Protocol wrong type for socket',
        92: 'Protocol not available',
        93: 'Unknown protocol',
        94: 'Socket type not supported',
        95: 'Not supported',
        96: 'Protocol family not supported',
        97: 'Address family not supported by protocol family',
        98: 'Address already in use',
        99: 'Address not available',
        100: 'Network interface is not configured',
        101: 'Network is unreachable',
        102: 'Connection reset by network',
        103: 'Connection aborted',
        104: 'Connection reset by peer',
        105: 'No buffer space available',
        106: 'Socket is already connected',
        107: 'Socket is not connected',
        108: "Can't send after socket shutdown",
        109: 'Too many references',
        110: 'Connection timed out',
        111: 'Connection refused',
        112: 'Host is down',
        113: 'Host is unreachable',
        114: 'Socket already connected',
        115: 'Connection already in progress',
        116: 'Stale file handle',
        122: 'Quota exceeded',
        123: 'No medium (in tape drive)',
        125: 'Operation canceled',
        130: 'Previous owner died',
        131: 'State not recoverable',
    }[-errno] || 'Unknown error');
}
/**
 * 获取执行目录
 */
function pwd() {
    return process.cwd();
}
function cmd(cmd) {
    return new Promise((resolve, reject) => {
        const child = child_process.spawn(cmd, defaults);
        child.stdout.on('data', (data) => {
            resolve(output(data.toString(), 0));
        });
        child.stderr.on('data', (data) => {
            resolve(output(data.toString(), 0));
        });
        child.on('error', (err) => {
            const message = `${err.message}\n` +
                `    errno: ${err.errno} (${errnoMessage(err.errno)})\n` +
                `    code: ${err.code}\n`;
            // log(message);
            reject(output(message, err.code));
        });
    });
}
// export function log(content: string) {
//   console.log(content);
// }
function output(message, exitCode) {
    return JSON.stringify({
        message,
        exitCode,
    });
}

var dist = {};

/*!
 * Rapido vundefined
 * (c) 2022-2022
 * Released under the MIT License.
 */

Object.defineProperty(dist, '__esModule', { value: true });

function log(content) {
    console.log(content);
}

var log_1 = dist.log = log;

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
    try {
        return await cmd('git branch');
    }
    catch (error) {
        log_1(JSON.stringify(error));
    }
}
/**
 * 获取git 分支列表
 */
async function getGitBranchList() {
    const result = JSON.parse((await getGitBranch()));
    if (result) {
        const splitList = result.message.split('\n').map((item) => {
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
        const { message } = JSON.parse((await cmd('git add .')));
        return message;
    }
    catch (error) {
        log_1(JSON.stringify(error));
    }
}
/**
 * git commit
 */
async function gitCommit(info) {
    try {
        const { message } = JSON.parse((await cmd(`git commit -m "${info}"`)));
        return message;
    }
    catch (error) {
        log_1(JSON.stringify(error));
    }
}
/**
 * 切换git 分支
 * @param branchName
 * @returns
 */
async function switchGitBranch(branchName) {
    try {
        const result = (await cmd(`git checkout ${branchName}`));
        const { message } = JSON.parse(result);
        return message;
    }
    catch (error) {
        log_1(JSON.stringify(error));
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
        const { message, exitCode } = JSON.parse((await cmd(`${manerger} ${getInstallpara(manerger)} ${name} ${dev ? '-D' : ''} ${g ? '-g' : ''}`)));
        if (exitCode === 0) {
            return true;
        }
        else {
            log_1(message);
        }
    }
    catch (error) {
        log_1(JSON.stringify(error));
    }
}
/**
 * npm 卸载包
 */
async function uninstallDep(name, { manerger = 'npm', g = false, } = {}) {
    try {
        const { message, exitCode } = JSON.parse((await cmd(`${manerger} ${getUnInstallpara(manerger)} ${name} ${g ? '-g' : ''}`)));
        if (exitCode === 0) {
            return true;
        }
        else {
            log_1(message);
        }
    }
    catch (error) {
        log_1(JSON.stringify(error));
    }
}

exports.cd = cd;
exports.cmd = cmd;
exports.config = config;
exports.errnoMessage = errnoMessage;
exports.getGitBranch = getGitBranch;
exports.getGitBranchList = getGitBranchList;
exports.getGitCurrentBranch = getGitCurrentBranch;
exports.getGitStatus = getGitStatus;
exports.gitAddAll = gitAddAll;
exports.gitCommit = gitCommit;
exports.installDep = installDep;
exports.isInstalled = isInstalled;
exports.output = output;
exports.pwd = pwd;
exports.switchGitBranch = switchGitBranch;
exports.uninstallDep = uninstallDep;