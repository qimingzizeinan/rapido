import inquirer from 'inquirer';
import path from 'path';
import { program } from 'commander';
import { copyToTaget } from '@rapido/fs';

const templates = [
  {
    name: 'base',
    src: path.join(__dirname, '../', `/template/base`),
  },
  {
    name: 'cocos',
    src: path.join(__dirname, '../', `/template/cocos`),
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
    const res = await inquirer.prompt(prompList);
    switch (res.template) {
      case 'base':
        copyToTaget(
          path.join(__dirname, '../', `/template/base`),
          `${process.cwd()}/rapidoDeploy`
        );
        console.log('创建成功');
        break;
      case 'cocos':
        copyToTaget(
          path.join(__dirname, '../', `/template/cocos`),
          `${process.cwd()}/rapidoDeploy`
        );
        console.log('创建成功');
        break;
      default:
        break;
    }
  });

// // 处理命令行输入的参数
program.parse(process.argv);
