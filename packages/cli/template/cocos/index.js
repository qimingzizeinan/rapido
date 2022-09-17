const {
  selectDeployEnv,
  getConfig,
  createSSH,
  compressFiles,
  deploy,
  rora,
  rchalk,
} = require('@rapidoq/fs');
const { step, errorInfo } = require('@rapidoq/utils');
const { cmd } = require('@rapidoq/shell');

async function start() {
  await createSSH();
  step('获取配置中...');
  const config = await selectDeployEnv(await getConfig());
  if (!config) {
    errorInfo('未找到配置');
    return;
  }

  step(`======== 开始部署 ========`);
  // 打包本地项目
  const command = config.local.buildCommand;
  try {
    const spinner = rora(rchalk.cyan(`正在执行本地build命令...\n`)).start();
    await cmd(command);
    spinner.succeed(chalk.green(`执行结束！\n`));
  } catch (error) {
    errorInfo(error.stderr);
  }

  await compressFiles(config.local);
  await deploy(config.local, config.server);
  step(`======== 部署完成 ========`);
  process.exit();
}

start();
