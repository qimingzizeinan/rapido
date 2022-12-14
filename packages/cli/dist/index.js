#!/usr/bin/env node
'use strict';

var path = require('path');
var utils = require('@rapidoq/utils');
var fs = require('@rapidoq/fs');
var shell = require('@rapidoq/shell');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const { program } = utils.rcommander;
const templates = [
    {
        name: 'base',
        src: path__default["default"].join(__dirname, '../', `/template/base`),
    },
    {
        name: 'cocos',
        src: path__default["default"].join(__dirname, '../', `/template/cocos`),
    },
];
// 命令行选择列表
let prompList = [
    {
        type: 'list',
        name: 'template',
        message: '请选择你想要生成的模板？',
        choices: templates,
        default: templates[0],
    },
];
// cli版本
// program.version(import('../package').version, '-v, --version', 'cli的最新版本');
// 设置选项
program
    .command('create')
    .description('创建部署文件')
    .action(async () => {
    const res = await utils.rinquirer.prompt(prompList);
    switch (res.template) {
        case 'base':
            fs.copyToTaget(path__default["default"].join(__dirname, '../', `/template/base`), `${process.cwd()}/rapidoqDeploy`);
            break;
        case 'cocos':
            const { manager } = await utils.rinquirer.prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: '请选择你想要使用的包管理器？',
                    choices: ['npm', 'pnpm', 'yarn'],
                },
            ]);
            console.log('manager', manager);
            fs.copyToTaget(path__default["default"].join(__dirname, '../', `/template/cocos`), `${process.cwd()}/rapidoqDeploy`);
            const spinner = utils.rora(utils.rchalk.cyan(`正在安装依赖包...\n`)).start();
            try {
                await shell.installDep('@rapidoq/fs', {
                    manerger: manager,
                    dev: true,
                });
            }
            catch (error) {
                console.log('安装@rapidoq/fs失败！', error);
            }
            try {
                await shell.installDep('@rapidoq/shell', {
                    dev: true,
                    manerger: manager,
                });
            }
            catch (error) {
                console.log('安装@rapidoq/shell失败！', error);
            }
            try {
                await shell.installDep('@rapidoq/utils', {
                    dev: true,
                    manerger: manager,
                });
            }
            catch (error) {
                console.log('安装@rapidoq/utils失败！', error);
            }
            spinner.succeed(utils.rchalk.green(`安装依赖包成功！\n`));
            const spinner1 = utils.rora(utils.rchalk.cyan(`正在复制配置文件...\n`)).start();
            const configPath = path__default["default"].join(__dirname, '../', `/cocosConfig`);
            if (!fs.isPathExist(path__default["default"].join(process.cwd(), './rapidoq-deploy-config.json'))) {
                fs.copyToTaget(configPath, `${process.cwd()}`);
            }
            spinner1.succeed(utils.rchalk.green(`复制配置文件成功！\n`));
            spinner1.succeed(utils.rchalk.green(`已创建！\n`));
            break;
    }
});
// // 处理命令行输入的参数
program.parse(process.argv);
