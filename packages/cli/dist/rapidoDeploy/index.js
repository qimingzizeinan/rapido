const { copyToTaget } = require('@rapidoq/fs');
const {
  cd,
  gitAddAll,
  getGitCurrentBranch,
  getGitBranchList,
  switchGitBranch,
  gitCommit,
  getGitStatus,
  gitPush,
} = require('@rapidoq/shell');
const path = require('path');
let inquirer;

// const orginPath = path.join(__dirname, '../dist');
// const targetPath = path.join(__dirname, '');

function checkGitBranch(branch) {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'change',
          message: `当前分支:${branch}. 是否修改版本号?默认 :false`,
          default: false,
        },
      ])
      .then((change) => {
        resolve(change);
      });
  });
}

async function selectBranch() {
  const branchs = await getGitBranchList();
  const templates = branchs.map((item) => {
    item = item.replace('*', '').trim();
    return {
      name: item,
      value: item,
    };
  });

  // 命令行选择列表
  let prompList = [
    {
      type: 'list',
      name: 'branch',
      message: '请选择想要切换的分支？',
      choices: templates,
      default: templates[0],
    },
  ];
  return new Promise((resolve) => {
    inquirer.prompt(prompList).then(({ branch }) => {
      resolve(branch);
    });
  });
}

async function getCommitInfoFromInterminal() {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'commit',
          message: '请输入commit信息？',
        },
      ])
      .then(({ commit }) => {
        resolve(commit);
      });
  });
}

async function run() {
  // await copyToTaget(orginPath, targetPath);
  // await cd(targetPath);

  // 获取当前分支
  const branch = await getGitCurrentBranch();
  // 检查分支是否正确
  const { change } = await checkGitBranch(branch);
  if (change) {
    // 切换分支
    const switchBranch = await selectBranch();
    await switchGitBranch(switchBranch);
  }
  await cd('/Users/wlm/learnBase/rapido');
  await gitAddAll();
  // 获取commit信息
  const info = await getCommitInfoFromInterminal();
  // commit
  await gitCommit(info);
  await gitPush();

  console.log('流程已完成');
}

(async () => {
  inquirer = await (await import('inquirer')).default;
  run();
})();
