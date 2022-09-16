import execa from 'execa';

const defaults = {
  cwd: process.cwd(),
};

/**
 * 切换工作目录
 * @param cwd
 *
 */
export async function cd(cwd: string) {
  defaults.cwd = cwd;
}

/**
 * 获取执行目录
 */
export function pwd() {
  return process.cwd();
}

export async function cmd(
  cmd: string,
  options?: execa.SyncOptions<string> | undefined
) {
  return await execa.commandSync(cmd, { ...defaults, ...options });
}

export const rexec = execa;
