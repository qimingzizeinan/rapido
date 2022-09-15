import { selectEnv, getConfig, buildDist, createSSH, compressDist, deploy} from '@rapidoq/fs'

async function start() {
    await createSSH()
    const CONFIG = await selectEnv(getConfig());
    if (!CONFIG) process.exit(1);

    step(`======== 开始部署 ========`);
    const [npm, ...script] = CONFIG.local.buildCommand.split(' ');
    // TODO 
    await buildDist(npm, [...script]);
    await compressDist(CONFIG.local);
    await deploy(CONFIG.local, CONFIG.server);
    step(`======== 部署完成 ========`);
    process.exit();
}

start()