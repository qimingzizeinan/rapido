import { cmd } from './cmd';
import { log } from '@rapidoq/utils';

/**
 * 判断是否安装了包
 * */
export function isInstalled(name: string) {
  try {
    require.resolve(name);
    return true;
  } catch (e) {
    return false;
  }
}

function getInstallpara(manerger: 'npm' | 'pnpm' | 'yarn') {
  switch (manerger) {
    case 'npm':
    case 'pnpm':
      return 'install';
    case 'yarn':
      return 'add';
  }
}

function getUnInstallpara(manerger: 'npm' | 'pnpm' | 'yarn') {
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
export async function installDep(
  name: string,
  {
    manerger = 'npm',
    g = false,
    dev = false,
  }: {
    manerger?: 'npm' | 'pnpm' | 'yarn';
    g?: boolean;
    dev?: boolean;
  } = {} as any
) {
  try {
    const { message, exitCode } = JSON.parse(
      (await cmd(
        `${manerger} ${getInstallpara(manerger)} ${name} ${dev ? '-D' : ''} ${
          g ? '-g' : ''
        }`
      )) as any
    );
    if (exitCode === 0) {
      return true;
    } else {
      log(message);
    }
  } catch (error) {
    log(JSON.stringify(error));
  }
}

/**
 * npm 卸载包
 */
export async function uninstallDep(
  name: string,
  {
    manerger = 'npm',
    g = false,
  }: { manerger: 'npm' | 'pnpm' | 'yarn'; g: boolean } = {} as any
) {
  try {
    const { message, exitCode } = JSON.parse(
      (await cmd(
        `${manerger} ${getUnInstallpara(manerger)} ${name} ${g ? '-g' : ''}`
      )) as any
    );
    if (exitCode === 0) {
      return true;
    } else {
      log(message);
    }
  } catch (error) {
    log(JSON.stringify(error));
  }
}
