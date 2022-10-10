import { NodeSSH } from 'node-ssh';
export declare function createSSH(): NodeSSH;
/**
 * 选择要部署环境
 * @param {*} CONFIG 配置文件内容
 */
export declare function selectDeployEnv(rootConfig: any): Promise<unknown>;
export declare function importAsync(path: any): Promise<unknown>;
export declare function getConfig(): Promise<any>;
/**
 * 压缩本地build出来的文件
 * @param {*} localConfig 本地配置
 * @param {*} next
 */
export declare function compressFiles(localConfig: any, next?: any): Promise<void>;
/**
 *
 * @param localConfig
 * @param serverConfig
 * @param next
 */
export declare function deploy(localConfig: any, serverConfig: any, next?: any): Promise<void>;
