/// <reference types="node" />
export declare type DefaultOptions = {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    windowsHide?: boolean;
    shell: string | boolean;
};
export declare type OutPut = {
    stdout: string;
    stderr: string;
    exitCode: number;
};
export declare function config(): void;
/**
 * 切换工作目录
 * @param cwd
 *
 */
export declare function cd(cwd: string): void;
export declare function errnoMessage(errno: number | undefined): string;
/**
 * 获取执行目录
 */
export declare function pwd(): string;
export declare function cmd(cmd: string): Promise<unknown>;
export declare function output(message: string, exitCode: number | string | undefined): string;
