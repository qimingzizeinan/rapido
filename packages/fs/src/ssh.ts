import { ConfigGiven } from 'node-ssh';

interface DeployConfig extends ConfigGiven {
  localFile: string; // 本地文件
  remoteFile: string; // 远程文件
}
import chalk from 'chalk';
import SSH from 'node-ssh';
import ora from 'ora';

export async function putCocosFileToServer(config: DeployConfig) {
  let spinner = ora();

  const ssh = new SSH();

  spinner.start(chalk.blue('正在连接服务器'));
  ssh
    .connect({
      ...config,
    })
    .then(async (nodeSSH) => {
      spinner.succeed(chalk.green('服务器连接成功'));
      spinner.start(chalk.blue('开始上传文件'));
      const putres = await nodeSSH.putDirectory(
        config.localFile,
        config.remoteFile
      );
      if (putres) {
        spinner.succeed(chalk.green('文件上传成功'));
      } else {
        spinner.fail(chalk.red('文件上传失败'));
      }
      nodeSSH.dispose();
    })
    .catch((err) => {
      spinner.fail(chalk.red('服务器连接失败'));
      console.log(chalk.bgRed(err));
    })
    .finally(() => {
      spinner.clear();
    });
}
