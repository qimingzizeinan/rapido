import fs from 'fs-extra';
/**
 * 将originDir目录下的文件复制到targetDir目录下
 */
export declare function copyToTaget(originDir: string, targetDir: string): void;
/**
 * 确保文件夹存在(文件夹目录结构没有会新建)
 * @param dir
 */
export declare function ensureDir(dir: string): void;
/**
 * 删除文件夹
 * @param dir
 * @returns
 */
export declare function removeDir(dir: string): void;
/**
 * 文件夹是否存在
 * @param dir
 * @returns
 * true: 存在   false: 不存在
 * */
export declare function isDirExist(dir: string): boolean;
/**
 * 获取文件夹下的文件列表
 * @param dir
 * @returns
 * 文件列表
 * */
export declare function getDirFiles(dir: string): string[];
/**
 * 删除文件或文件夹
 * @param path
 * @returns
 * true: 删除成功   false: 删除失败
 */
export declare function remove(path: string): void;
/**
 * 测试给定路径是否存在
 * @param path
 *  true: 存在   false: 不存在
 * */
export declare function isPathExist(path: string): boolean;
export declare function readJsonSync(file: string, options?: string | fs.ReadOptions | undefined): any;
export declare function writeJsonSync(file: string, object: any, options?: string | fs.WriteOptions | undefined): void;
export declare const fsExtra: typeof fs;
