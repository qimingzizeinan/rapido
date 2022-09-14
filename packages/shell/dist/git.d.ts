/**
 * 获取git 状态
 * @returns
 */
export declare function getGitStatus(): Promise<unknown>;
/**
 * 获取git 分支
 * @returns
 */
export declare function getGitBranch(): Promise<unknown>;
/**
 * git push
 */
export declare function gitPush(): Promise<unknown>;
/**
 * 获取git 分支列表
 */
export declare function getGitBranchList(): Promise<any>;
/**
 * 获取git 当前分支
 */
export declare function getGitCurrentBranch(): Promise<string | undefined>;
/**
 * git add
 */
export declare function gitAddAll(): Promise<any>;
/**
 * git commit
 */
export declare function gitCommit(info: string): Promise<any>;
/**
 * 切换git 分支
 * @param branchName
 * @returns
 */
export declare function switchGitBranch(branchName: string): Promise<any>;
