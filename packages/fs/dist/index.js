/*!
 * Rapido v2.0.0
 * (c) 2022-2022
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var nodeSsh = require('node-ssh');
var utils = require('@rapidoq/utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

/**
 * 将originDir目录下的文件复制到targetDir目录下
 */
function copyToTaget(originDir, targetDir) {
    fs__default["default"].copySync(originDir, targetDir);
}
/**
 * 确保文件夹存在(文件夹目录结构没有会新建)
 * @param dir
 */
function ensureDir(dir) {
    return fs__default["default"].ensureDirSync(dir);
}
/**
 * 删除文件夹
 * @param dir
 * @returns
 */
function removeDir(dir) {
    return fs__default["default"].removeSync(dir);
}
/**
 * 文件夹是否存在
 * @param dir
 * @returns
 * true: 存在   false: 不存在
 * */
function isDirExist(dir) {
    return fs__default["default"].existsSync(dir);
}
/**
 * 获取文件夹下的文件列表
 * @param dir
 * @returns
 * 文件列表
 * */
function getDirFiles(dir) {
    return fs__default["default"].readdirSync(dir);
}
/**
 * 删除文件或文件夹
 * @param path
 * @returns
 * true: 删除成功   false: 删除失败
 */
function remove(path) {
    return fs__default["default"].removeSync(path);
}
/**
 * 测试给定路径是否存在
 * @param path
 *  true: 存在   false: 不存在
 * */
function isPathExist(path) {
    return fs__default["default"].pathExistsSync(path);
}
function readJsonSync(file, options) {
    return fs__default["default"].readJSONSync(file, options);
}
function writeJsonSync(file, object, options) {
    return fs__default["default"].writeJSONSync(file, object, options);
}
const fsExtra = fs__default["default"];

const configFileName = 'rapidoq-deploy-config';
let SSH;
function createSSH() {
    return (SSH = new nodeSsh.NodeSSH());
}
/**
 * 选择要部署环境
 * @param {*} CONFIG 配置文件内容
 */
function selectDeployEnv(rootConfig) {
    return new Promise(async (resolve, reject) => {
        const select = await utils.rinquirer.prompt({
            type: 'list',
            name: 'selectConfig',
            choices: rootConfig.map((item, index) => ({
                name: `${item.server.name}`,
                value: index,
            })),
        });
        const selectedServer = rootConfig[Object.values(select)[0]];
        if (selectedServer) {
            resolve(selectedServer);
        }
        else {
            reject();
        }
    });
}
function importAsync(path) {
    return new Promise((resolve, reject) => {
        (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(path)
            .then((res) => resolve(res))
            .catch((err) => {
            reject(err);
        });
    });
}
// 获取根目录配置
async function getConfig() {
    const configFile = utils.resolvePath(process.cwd(), `./${configFileName}.json`);
    if (!fs__default["default"].existsSync(configFile)) {
        utils.errorInfo(`${configFile} 不存在！`);
        utils.info(`请先在项目根目录新建"${configFileName}.json"，内容如下：
    [
      {
        "local": {
          "buildCommand": "yarn build",
          "distDir": "./dist",
          "distZip": "./dist.zip"
        },
        "server": {
          "name": "server1",
          "host": "0.0.0.0",
          "port": "22",
          "username": "username",
          "password": "password",
          "distDir": "/var/www/xxx/xxx",
          "distZipName": "dist",
          "backup": false
        }
      }
    ]
    `);
        return;
    }
    // 读取配置文件
    let config;
    try {
        const result = await importAsync(configFile);
        config = result.default;
    }
    catch (error) {
        utils.errorInfo(error);
        return;
    }
    try {
        const localKeys = ['buildCommand', 'distDir', 'distZip'];
        const serverKeys = [
            'name',
            'host',
            'port',
            'username',
            'password',
            'distDir',
            'distZipName',
            'backup',
        ];
        const configError = config.some((item) => {
            const localKeys = Object.keys(item.local);
            const serverKeys = Object.keys(item.server);
            const hasAllLocalKey = localKeys.every((item) => localKeys.includes(item));
            const hasAllServerKey = serverKeys.every((item) => serverKeys.includes(item));
            return !hasAllLocalKey || !hasAllServerKey;
        });
        // 配置项错误
        if (configError) {
            utils.errorInfo(`${configFileName}.json 配置不正确！\n`);
            utils.info(`local需要的字段：{${localKeys.join(', ')}}，server需要的字段：{${serverKeys.join(', ')}}\n`);
            return;
        }
    }
    catch (err) {
        utils.errorInfo(err);
    }
    return config;
}
/**
 * 压缩本地build出来的文件
 * @param {*} localConfig 本地配置
 * @param {*} next
 */
async function compressFiles(localConfig, next) {
    try {
        const { distDir, distZip } = localConfig;
        const dist = utils.resolvePath(process.cwd(), distDir);
        if (!fs__default["default"].existsSync(dist)) {
            utils.errorInfo(`× 压缩失败！`);
            utils.errorInfo(`× 打包路径 [local.distDir] 配置不正确！ ${dist} 不存在！\n`);
            return;
        }
        const spinner = utils.rora(utils.rchalk.cyan(`正在压缩...\n`)).start();
        utils.rzipper.sync.zip(dist).compress().save(utils.resolvePath(process.cwd(), distZip));
        spinner.succeed(utils.rchalk.green(`压缩完成！\n`));
        if (next)
            next();
    }
    catch (err) {
        utils.errorInfo(`压缩失败！ \n error:${JSON.stringify(err)}`);
    }
}
/**
 * 通过 ssh 在服务器上执行命令
 * @param {*} cmd shell 命令
 * @param {*} cwd 路径
 */
async function runCommandAtServer(cmd, cwd) {
    await SSH.execCommand(cmd, {
        cwd,
        onStderr(chunk) {
            utils.errorInfo(`${cmd}, stderrChunk, ${chunk.toString('utf8')}`);
        },
    });
}
/**
 * 连接服务器
 * @param {*} params { host, port, username, password }
 */
async function connectServer(params) {
    const spinner = utils.rora(utils.rchalk.cyan(`正在连接服务器...\n`)).start();
    await SSH.connect(params)
        .then(() => {
        spinner.succeed(utils.rchalk.green(`服务器连接成功！\n`));
    })
        .catch((err) => {
        spinner.fail(utils.rchalk.red(`服务器连接失败！\n`));
        utils.errorInfo(err);
        process.exit(1);
    });
}
/**
 *
 * @param localConfig
 * @param serverConfig
 * @param next
 */
async function deploy(localConfig, serverConfig, next) {
    const { host, port, username, password, distDir, distZipName, backup } = serverConfig;
    if (!host || !username || !password || !distDir || !distZipName) {
        utils.errorInfo(`${configFileName}.json 配置不正确！`);
        process.exit(1);
    }
    if (!distDir.startsWith('/') || distDir === '/') {
        utils.errorInfo(`[server.distDir: ${distDir}] 需为绝对路径，且不能为根目录"/"`);
        process.exit(1);
    }
    // privateKey: '/home/steel/.ssh/id_rsa'
    // 连接服务器
    await connectServer({ host, port, username, password });
    const spinner = utils.rora(utils.rchalk.cyan(`正在部署项目...\n`)).start();
    try {
        // 上传压缩的项目文件
        await SSH.putFile(utils.resolvePath(process.cwd(), localConfig.distZip), `${distDir}/${distZipName}.zip`).catch((err) => {
            console.log('[error]putFile: ', err);
        });
        if (backup) {
            // 备份重命名原项目的文件
            await runCommandAtServer(`mv ${distZipName} ${distZipName}_${utils.getTime()}`, distDir);
        }
        else {
            // 删除原项目的文件
            await runCommandAtServer(`rm -rf ${distZipName}`, distDir).catch((err) => {
                console.log('[error]rmOldFile: ', err);
            });
        }
        // 修改文件权限
        await runCommandAtServer(`chmod 777 ${distZipName}.zip`, distDir).catch((err) => {
            console.log('[error]chmod: ', err);
        });
        // 解压缩上传的项目文件
        await runCommandAtServer(`unzip ./${distZipName}.zip -d ${distZipName}`, distDir).catch((err) => {
            console.log('[error]unzip: ', err);
        });
        // 删除服务器上的压缩的项目文件
        await runCommandAtServer(`rm -rf ./${distZipName}.zip`, distDir).catch((err) => {
            console.log('[error]rmzip: ', err);
        });
        spinner.succeed(utils.rchalk.green(`部署成功\n`));
        await SSH.dispose();
        SSH = null;
        utils.info(`项目路径： ${distDir}`);
        utils.info(`完成时间: ${new Date()}`);
        utils.info('');
        if (next)
            next();
    }
    catch (err) {
        spinner.fail(utils.rchalk.red(`部署失败\n`));
        utils.errorInfo(`catch: ${err}`);
        process.exit(1);
    }
}

exports.compressFiles = compressFiles;
exports.copyToTaget = copyToTaget;
exports.createSSH = createSSH;
exports.deploy = deploy;
exports.ensureDir = ensureDir;
exports.fsExtra = fsExtra;
exports.getConfig = getConfig;
exports.getDirFiles = getDirFiles;
exports.importAsync = importAsync;
exports.isDirExist = isDirExist;
exports.isPathExist = isPathExist;
exports.readJsonSync = readJsonSync;
exports.remove = remove;
exports.removeDir = removeDir;
exports.selectDeployEnv = selectDeployEnv;
exports.writeJsonSync = writeJsonSync;
