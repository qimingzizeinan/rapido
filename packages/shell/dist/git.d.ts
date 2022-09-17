/**
 * 获取git 状态
 * @returns
 */
export declare function getGitStatus(): Promise<import("execa").ExecaSyncReturnValue<string> | undefined>;
/**
 * 获取git 分支
 * @returns
 */
export declare function getGitBranch(): Promise<import("execa").ExecaSyncReturnValue<string>>;
/**
 * git push
 */
export declare function gitPush(): Promise<import("execa").ExecaSyncReturnValue<string> | undefined>;
/**
 * 获取git 分支列表
 */
export declare function getGitBranchList(): Promise<string[] | undefined>;
/**
 * 获取git 当前分支
 */
export declare function getGitCurrentBranch(): Promise<string | undefined>;
/**
 * git add
 */
export declare function gitAddAll(): Promise<string | undefined>;
/**
 * git commit
 */
export declare function gitCommit(info: string): Promise<string | undefined>;
/**
 * 切换git 分支
 * @param branchName
 * @returns
 */
export declare function switchGitBranch(branchName: string): Promise<string | undefined>;
