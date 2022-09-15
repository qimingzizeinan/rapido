import fs from 'fs-extra';
export * from './ssh';

/**
 * 将originDir目录下的文件复制到targetDir目录下
 */
export function copyToTaget(originDir: string, targetDir: string) {
  fs.copySync(originDir, targetDir);
}

/**
 * 确保文件夹存在(文件夹目录结构没有会新建)
 * @param dir
 */
export function ensureDir(dir: string) {
  return fs.ensureDirSync(dir);
}

/**
 * 删除文件夹
 * @param dir
 * @returns
 */
export function removeDir(dir: string) {
  return fs.removeSync(dir);
}

/**
 * 文件夹是否存在
 * @param dir
 * @returns
 * true: 存在   false: 不存在
 * */
export function isDirExist(dir: string) {
  return fs.existsSync(dir);
}
/**
 * 获取文件夹下的文件列表
 * @param dir
 * @returns
 * 文件列表
 * */
export function getDirFiles(dir: string) {
  return fs.readdirSync(dir);
}

/**
 * 删除文件或文件夹
 * @param path
 * @returns
 * true: 删除成功   false: 删除失败
 */
export function remove(path: string) {
  return fs.removeSync(path);
}

/**
 * 测试给定路径是否存在
 * @param path
 *  true: 存在   false: 不存在
 * */
export function isPathExist(path: string) {
  return fs.pathExistsSync(path);
}

export function readJsonSync(
  file: string,
  options?: string | fs.ReadOptions | undefined
) {
  return fs.readJSONSync(file, options);
}

export function writeJsonSync(
  file: string,
  object: any,
  options?: string | fs.WriteOptions | undefined
) {
  return fs.writeJSONSync(file, object, options);
}

export const fsExtra = fs;
