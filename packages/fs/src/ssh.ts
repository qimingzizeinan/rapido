import fs from 'fs-extra';
import { NodeSSH } from 'node-ssh';
import {
  resolvePath,
  info,
  getTime,
  errorInfo,
  rora,
  rzipper,
  rchalk,
  rinquirer,
} from '@rapidoq/utils';

const configFileName = 'rapidoq-deploy-config';

let SSH;

export function createSSH() {
  return (SSH = new NodeSSH());
}

/**
 * 选择要部署环境
 * @param {*} CONFIG 配置文件内容
 */
export function selectDeployEnv(rootConfig) {
  return new Promise(async (resolve, reject) => {
    const select = await rinquirer.prompt({
      type: 'list',
      name: 'selectConfig',
      choices: rootConfig.map((item, index) => ({
        name: `${item.server.name}`,
        value: index,
      })),
    });

    const selectedServer = rootConfig[Object.values(select)[0] as any];

    if (selectedServer) {
      resolve(selectedServer);
    } else {
      reject();
    }
  });
}

export function importAsync(path) {
  return new Promise((resolve, reject) => {
    import(path)
      .then((res) => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });
}

// 获取根目录配置
export async function getConfig() {
  const configFile = resolvePath(process.cwd(), `./${configFileName}.json`);
  if (!fs.existsSync(configFile)) {
    errorInfo(`${configFile} 不存在！`);
    info(`请先在项目根目录新建"${configFileName}.json"，内容如下：
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
    config = (result as any).default;
  } catch (error) {
    errorInfo(error);
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

      const hasAllLocalKey = localKeys.every((item) =>
        localKeys.includes(item)
      );
      const hasAllServerKey = serverKeys.every((item) =>
        serverKeys.includes(item)
      );
      return !hasAllLocalKey || !hasAllServerKey;
    });

    // 配置项错误
    if (configError) {
      errorInfo(`${configFileName}.json 配置不正确！\n`);
      info(
        `local需要的字段：{${localKeys.join(
          ', '
        )}}，server需要的字段：{${serverKeys.join(', ')}}\n`
      );
      return;
    }
  } catch (err) {
    errorInfo(err);
  }
  return config;
}

/**
 * 压缩本地build出来的文件
 * @param {*} localConfig 本地配置
 * @param {*} next
 */
export async function compressFiles(localConfig, next?) {
  try {
    const { distDir, distZip } = localConfig;
    const dist = resolvePath(process.cwd(), distDir);

    if (!fs.existsSync(dist)) {
      errorInfo(`× 压缩失败！`);
      errorInfo(`× 打包路径 [local.distDir] 配置不正确！ ${dist} 不存在！\n`);
      return;
    }

    const spinner = rora(rchalk.cyan(`正在压缩...\n`)).start();

    rzipper.sync.zip(dist).compress().save(resolvePath(process.cwd(), distZip));

    spinner.succeed(rchalk.green(`压缩完成！\n`));
    if (next) next();
  } catch (err) {
    errorInfo(`压缩失败！ \n error:${JSON.stringify(err)}`);
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
      errorInfo(`${cmd}, stderrChunk, ${chunk.toString('utf8')}`);
    },
  });
}

/**
 * 连接服务器
 * @param {*} params { host, port, username, password }
 */
async function connectServer(params) {
  const spinner = rora(rchalk.cyan(`正在连接服务器...\n`)).start();
  await SSH.connect(params)
    .then(() => {
      spinner.succeed(rchalk.green(`服务器连接成功！\n`));
    })
    .catch((err) => {
      spinner.fail(rchalk.red(`服务器连接失败！\n`));
      errorInfo(err);
      process.exit(1);
    });
}

/**
 *
 * @param localConfig
 * @param serverConfig
 * @param next
 */
export async function deploy(localConfig, serverConfig, next?) {
  const { host, port, username, password, distDir, distZipName, backup } =
    serverConfig;

  if (!host || !username || !password || !distDir || !distZipName) {
    errorInfo(`${configFileName}.json 配置不正确！`);
    process.exit(1);
  }
  if (!distDir.startsWith('/') || distDir === '/') {
    errorInfo(`[server.distDir: ${distDir}] 需为绝对路径，且不能为根目录"/"`);
    process.exit(1);
  }

  // privateKey: '/home/steel/.ssh/id_rsa'
  // 连接服务器
  await connectServer({ host, port, username, password });

  const spinner = rora(rchalk.cyan(`正在部署项目...\n`)).start();

  try {
    // 上传压缩的项目文件
    await SSH.putFile(
      resolvePath(process.cwd(), localConfig.distZip),
      `${distDir}/${distZipName}.zip`
    ).catch((err) => {
      console.log('[error]putFile: ', err);
    });

    if (backup) {
      // 备份重命名原项目的文件
      await runCommandAtServer(
        `mv ${distZipName} ${distZipName}_${getTime()}`,
        distDir
      );
    } else {
      // 删除原项目的文件
      await runCommandAtServer(`rm -rf ${distZipName}`, distDir).catch(
        (err) => {
          console.log('[error]rmOldFile: ', err);
        }
      );
    }

    // 修改文件权限
    await runCommandAtServer(`chmod 777 ${distZipName}.zip`, distDir).catch(
      (err) => {
        console.log('[error]chmod: ', err);
      }
    );

    // 解压缩上传的项目文件
    await runCommandAtServer(
      `unzip ./${distZipName}.zip -d ${distZipName}`,
      distDir
    ).catch((err) => {
      console.log('[error]unzip: ', err);
    });

    // 删除服务器上的压缩的项目文件
    await runCommandAtServer(`rm -rf ./${distZipName}.zip`, distDir).catch(
      (err) => {
        console.log('[error]rmzip: ', err);
      }
    );

    spinner.succeed(rchalk.green(`部署成功\n`));

    await SSH.dispose();
    SSH = null;

    info(`项目路径： ${distDir}`);
    info(`完成时间: ${new Date()}`);
    info('');
    if (next) next();
  } catch (err) {
    spinner.fail(rchalk.red(`部署失败\n`));
    errorInfo(`catch: ${err}`);
    process.exit(1);
  }
}
