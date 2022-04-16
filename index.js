// const github = require('@actions/github');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const { URL } = require('url');

// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }

const sourceRepos = core.getInput('source_repo', { required: true }).trim().split(',')
const targetRepos = core.getInput('target_repo', { required: true }).trim().split(',')
const token = core.getInput('github_token', { required: true }).trim()

const source_tags = core.getInput('source_tag', { required: true }).trim().split(',')
const source_branchs = core.getInput('source_branch').trim().split(',')


const generateURL = (repoUrl, token) => {
  const url = new URL(repoUrl)
  url.username = 'oauth2'
  url.password = token
  return url.toString()
}

const workdir = 'work'

async function run() {
/**
 * 同步代码到目标仓库，并创建tag分支
git clone https://github.com/wangsongc/myaction.git -b main
cd myaction
git checkout -b v1.1 --depth=1
git push --mirror https://github.com/wangsongc/target.git
 */
  try {
    sourceRepos.forEach((value, index) => {
      await exec('git', [
        'clone',
        `--branch ${source_branchs[index]}`,
        generateURL(value, token),
        workdir,
      ]);

      await exec(
        'git',
        ['checkout', `-b ${source_tags[index]} --depth=1`],
        {
          cwd: `./${workdir}`,
        }
      );

      await exec(
        'git',
        ['push', '--mirror', generateURL(targetRepos[index], token)],
        {
          cwd: `./${workdir}`,
        }
      );
    })

    // if (!destRepo.startsWith('https://')) {
    //   throw new Error('only support https repo type now')
    // }
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
  //
}

run()
