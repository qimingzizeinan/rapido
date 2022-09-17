import ora from 'ora';
import * as commander from 'commander';
export declare const rora: typeof ora;
export declare const rchalk: import("chalk").ChalkInstance;
export declare const rzipper: any;
export declare const rinquirer: any;
export declare const rcommander: typeof commander;
export declare function log(content: string): void;
/**
 * 拼接解析
 * @param {*} _path
 * @param {*} _file
 */
export declare const resolvePath: (_path: any, _file: any) => string;
/**
 * 获取时间
 * @returns 2020-6-19_00-00-00
 */
export declare const getTime: () => string;
export declare const step: (text: any) => void;
export declare const info: (text: any) => void;
export declare const successInfo: (text: any) => void;
export declare const errorInfo: (text: any) => void;
