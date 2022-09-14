/**
 * 判断是否安装了包
 * */
export declare function isInstalled(name: string): boolean;
/**
 * npm 安装包
 */
export declare function installDep(name: string, { manerger, g, dev, }?: {
    manerger?: 'npm' | 'pnpm' | 'yarn';
    g?: boolean;
    dev?: boolean;
}): Promise<true | undefined>;
/**
 * npm 卸载包
 */
export declare function uninstallDep(name: string, { manerger, g, }?: {
    manerger: 'npm' | 'pnpm' | 'yarn';
    g: boolean;
}): Promise<true | undefined>;
