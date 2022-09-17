import { log } from '@rapidoq/utils';
import { cmd } from './cmd';

/**
 * 获取git 状态
 * @returns
 */
export async function getGitStatus() {
  try {
    return await cmd('git status');
  } catch (error) {}
}

/**
 * 获取git 分支
 * @returns
 */
export async function getGitBranch() {
  return await cmd('git branch');
}

/**
 * git push
 */
export async function gitPush() {
  try {
    return await cmd('git push');
  } catch (error) {
    log((error as any).stderr);
  }
}

/**
 * 获取git 分支列表
 */
export async function getGitBranchList() {
  const result = await getGitBranch();
  if (result) {
    const splitList = result.stdout.split('\n').map((item) => {
      return item.replace(',', '').trim();
    });
    return splitList.filter((item) => item);
  }
}

/**
 * 获取git 当前分支
 */
export async function getGitCurrentBranch() {
  const branchList = await getGitBranchList();
  if (branchList) {
    let currentBranch = '';
    branchList.forEach((item: any) => {
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
export async function gitAddAll() {
  try {
    const { stdout } = await cmd('git add .');
    return stdout;
  } catch (error) {
    log((error as any).stderr);
  }
}

/**
 * git commit
 */
export async function gitCommit(info: string) {
  try {
    const { stdout } = await cmd(`git commit -m "${info}"`);
    return stdout;
  } catch (error) {
    log((error as any).stderr);
  }
}

/**
 * 切换git 分支
 * @param branchName
 * @returns
 */
export async function switchGitBranch(branchName: string) {
  try {
    const result = await cmd(`git checkout ${branchName}`);
    return result.stdout || result.stderr;
  } catch (error) {
    log((error as any).stderr);
  }
}
