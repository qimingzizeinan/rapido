/// <reference types="node" />
import execa from 'execa';
/**
 * 切换工作目录
 * @param cwd
 *
 */
export declare function cd(cwd: string): Promise<void>;
/**
 * 获取执行目录
 */
export declare function pwd(): string;
export declare function cmd(cmd: string, options?: execa.SyncOptions<string> | undefined): Promise<execa.ExecaSyncReturnValue<string>>;
export declare const rexec: {
    (file: string, arguments?: readonly string[] | undefined, options?: execa.Options<string> | undefined): execa.ExecaChildProcess<string>;
    (file: string, arguments?: readonly string[] | undefined, options?: execa.Options<null> | undefined): execa.ExecaChildProcess<Buffer>;
    (file: string, options?: execa.Options<string> | undefined): execa.ExecaChildProcess<string>;
    (file: string, options?: execa.Options<null> | undefined): execa.ExecaChildProcess<Buffer>;
    sync(file: string, arguments?: readonly string[] | undefined, options?: execa.SyncOptions<string> | undefined): execa.ExecaSyncReturnValue<string>;
    sync(file: string, arguments?: readonly string[] | undefined, options?: execa.SyncOptions<null> | undefined): execa.ExecaSyncReturnValue<Buffer>;
    sync(file: string, options?: execa.SyncOptions<string> | undefined): execa.ExecaSyncReturnValue<string>;
    sync(file: string, options?: execa.SyncOptions<null> | undefined): execa.ExecaSyncReturnValue<Buffer>;
    command(command: string, options?: execa.Options<string> | undefined): execa.ExecaChildProcess<string>;
    command(command: string, options?: execa.Options<null> | undefined): execa.ExecaChildProcess<Buffer>;
    commandSync(command: string, options?: execa.SyncOptions<string> | undefined): execa.ExecaSyncReturnValue<string>;
    commandSync(command: string, options?: execa.SyncOptions<null> | undefined): execa.ExecaSyncReturnValue<Buffer>;
    node(scriptPath: string, arguments?: readonly string[] | undefined, options?: execa.NodeOptions<string> | undefined): execa.ExecaChildProcess<string>;
    node(scriptPath: string, arguments?: readonly string[] | undefined, options?: execa.Options<null> | undefined): execa.ExecaChildProcess<Buffer>;
    node(scriptPath: string, options?: execa.Options<string> | undefined): execa.ExecaChildProcess<string>;
    node(scriptPath: string, options?: execa.Options<null> | undefined): execa.ExecaChildProcess<Buffer>;
};
