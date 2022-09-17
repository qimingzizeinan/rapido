import path from 'path';
import { rchalk, rcommander, rinquirer, rora } from '@rapidoq/utils';
import { copyToTaget, isPathExist } from '@rapidoq/fs';
import { installDep } from '@rapidoq/shell';

const { program } = rcommander;

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
    const res = await rinquirer.prompt(prompList);
    switch (res.template) {
      case 'base':
        copyToTaget(
          path.join(__dirname, '../', `/template/base`),
          `${process.cwd()}/rapidoqDeploy`
        );
        break;
      case 'cocos':
        const { manager } = await rinquirer.prompt([
          {
            type: 'list',
            name: 'manager',
            message: '请选择你想要使用的包管理器？',
            choices: ['npm', 'pnpm', 'yarn'],
          },
        ]);

        console.log('manager', manager);

        copyToTaget(
          path.join(__dirname, '../', `/template/cocos`),
          `${process.cwd()}/rapidoqDeploy`
        );

        const spinner = rora(rchalk.cyan(`正在安装依赖包...\n`)).start();
        try {
          await installDep('@rapidoq/fs', {
            manerger: manager,
            dev: true,
          });
        } catch (error) {
          console.log('安装@rapidoq/fs失败！', error);
        }
        try {
          await installDep('@rapidoq/shell', {
            dev: true,
            manerger: manager,
          });
        } catch (error) {
          console.log('安装@rapidoq/shell失败！', error);
        }
        try {
          await installDep('@rapidoq/utils', {
            dev: true,
            manerger: manager,
          });
        } catch (error) {
          console.log('安装@rapidoq/utils失败！', error);
        }
        spinner.succeed(rchalk.green(`安装依赖包成功！\n`));

        const spinner1 = rora(rchalk.cyan(`正在复制配置文件...\n`)).start();

        const configPath = path.join(__dirname, '../', `/cocosConfig`);

        if (
          !isPathExist(path.join(process.cwd(), './rapidoq-deploy-config.json'))
        ) {
          copyToTaget(configPath, `${process.cwd()}`);
        }

        spinner1.succeed(rchalk.green(`复制配置文件成功！\n`));

        spinner1.succeed(rchalk.green(`已创建！\n`));
        break;
      default:
        break;
    }
  });

// // 处理命令行输入的参数
program.parse(process.argv);
