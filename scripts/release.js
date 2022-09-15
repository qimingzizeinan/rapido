const fs = require('fs');
const path = require('path');
const currentVersion = require('../package.json').version;
const execa = require('execa');
const chalk = require('chalk');
const semver = require('semver');
const build = require('./build');

// 获取packages
// const packages = fs
//   .readdirSync(path.resolve(__dirname, '../packages'))
//   .filter((p) => !p.startsWith('.'));
const packages = ['utils', 'shell', 'fs', 'cli'];
// 获取package 根目录
const getPkgRoot = (pkg) => path.resolve(__dirname, '../packages/' + pkg);

// 增加版本号
const increaseVersion = (version, type) => semver.inc(version, type);
// 执行terminal 命令
const runCmd = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });
// 控制台输出
const step = (msg) => console.log(chalk.cyan(msg));
// 版本增加选择
const versionIncrements = ['patch', 'minor', 'major'];
// 更新package.json version
function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function getPackageVersion(pkgRoot) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return pkg.version;
}

// 发布package
async function publishPackage(pkgName, version) {
  const pkgRoot = getPkgRoot(pkgName);
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const publishedName = pkg.name;
  if (pkg.private) {
    return;
  }

  step(`Publishing ${publishedName}...`);
  try {
    await runCmd('pnpm', ['publish', '--access', 'public'], {
      cwd: pkgRoot,
      stdio: 'pipe',
    });
    console.log(chalk.green(`成功发布 ${publishedName}@${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`跳过已发布的包: ${publishedName}`));
    } else {
      throw e;
    }
  }
}

let inquirer = '';

async function _publish(releasePackages) {
  step(`\n发布${releasePackages[0]}包流程...`);
  const { release } = await inquirer.prompt({
    type: 'list',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(
      (type) =>
        `${type} (${increaseVersion(
          getPackageVersion(getPkgRoot(releasePackages[0])),
          type
        )})`
    ),
  });

  const targetVersion = release.match(/\((.*)\)/)[1];

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes } = await inquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `发布 v${targetVersion}版本. Confirm?`,
  });

  if (!yes) {
    return;
  }

  step('\n更新package version...');
  releasePackages.forEach((package) =>
    updatePackage(getPkgRoot(package), targetVersion)
  );

  step('\npnpm building packages...');
  await build(releasePackages[0]);

  // 生成 changelog
  step('\nGenerating changelog...');
  await runCmd(`pnpm`, ['run', 'changelog']);

  // commit
  const { stdout } = await runCmd('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\ngit 提交');
    await runCmd('git', ['add', '.']);
    await runCmd('git', ['commit', '-m', `feat: release v${targetVersion}`]);
  } else {
    console.log('No changes to commit.');
  }

  // 发布包
  step('\nPublishing packages...');
  for (const pkg of releasePackages) {
    await publishPackage(pkg, targetVersion);
  }

  // push到github
  await runCmd('git', ['push']);

  step('\n已完成');
}

async function main() {
  const { releasePackages } = await inquirer.prompt({
    type: 'checkbox',
    name: 'releasePackages',
    message: 'Select release package',
    choices: packages,
  });

  for (const iterator of releasePackages) {
    await _publish([iterator]);
  }
}

(async () => {
  inquirer = await (await import('inquirer')).default;
  main();
})();
