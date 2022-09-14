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
  try {
    return await cmd('git branch');
  } catch (error) {
    log(JSON.stringify(error));
  }
}

/**
 * git push
 */
export async function gitPush() {
  try {
    return await cmd('git push');
  } catch (error) {
    log(JSON.stringify(error));
  }
}
/**
 * 获取git 分支列表
 */
export async function getGitBranchList() {
  const result = JSON.parse((await getGitBranch()) as any);
  if (result) {
    const splitList = result.message.split('\n').map((item) => {
      return item.replace(',', '').trim();
    });
    return splitList.filter((item) => item);
  }
}

/**
 * git not add
 */
export async function getGitNotAdd() {
  try {
    return await cmd('git status -s');
  } catch (error) {
    log(JSON.stringify(error));
  }
}
/**
 * git need to commit
 */
export async function gitNeedToCommit() {
  const result = JSON.parse((await getGitStatus()) as any);
  if (result) {
    return result.message.includes('Changes not staged for commit');
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
    const { message } = JSON.parse((await cmd('git add .')) as string);
    return message;
  } catch (error) {
    log(JSON.stringify(error));
  }
}

/**
 * git commit
 */
export async function gitCommit(info: string) {
  try {
    const { message } = JSON.parse(
      (await cmd(`git commit -m "${info}"`)) as string
    );
    return message;
  } catch (error) {
    log(JSON.stringify(error));
  }
}

/**
 * 切换git 分支
 * @param branchName
 * @returns
 */
export async function switchGitBranch(branchName: string) {
  try {
    const result = (await cmd(`git checkout ${branchName}`)) as string;
    const { message } = JSON.parse(result);
    return message;
  } catch (error) {
    log(JSON.stringify(error));
  }
}
