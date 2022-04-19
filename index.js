const core = require('@actions/core');
const { exec } = require('@actions/exec');
const { url } = require('inspector');
const { URL } = require('url');

const getProjectName = (repoUrl) => {
  return repoUrl.match(/(?<=\/)[^\/]+(?=\.git)/)[0];
};

function generateURL(repoUrl, token) {
  const url = new URL(repoUrl);
  url.username = 'oauth2';
  url.password = token;
  return url.toString();
}

const token = core.getInput('github_token', { required: true }).trim();
const sourceRepos = core
  .getInput('source_repo', { required: true })
  .trim()
  .split(',')
  .map((item) => {
    return generateURL(item.trim(), token);
  });
const targetRepos = core
  .getInput('target_repo', { required: true })
  .split(',')
  .map((item) => {
    return generateURL(item.trim(), token);
  });

const source_tags = core
  .getInput('source_tag', { required: true })
  .split(',')
  .map((item) => {
    item.trim();
  });
const source_branchs = core
  .getInput('source_branch')
  .trim()
  .split(',')
  .map((item) => {
    item.trim();
  });

const project_names = sourceRepos.map((item) => {
  return getProjectName(item);
});

async function run() {
  try {
    for (let index = 0; index < sourceRepos.length; index++) {
      await exec('git', [
        'clone',
        `--branch=${source_branchs[index]}`,
        sourceRepos[index],
        `${project_names[index]}`
      ]);

      await exec(
        'git',
        ['remote', 'set-url', 'origin', `${targetRepos[index]}`],
        {
          cwd: `./${project_names[index]}`
        }
      );

      await exec('git', ['checkout', `${source_tags[index]}`], {
        cwd: `./${project_names[index]}`
      });

      await exec(
        'git',
        ['push', 'origin', `HEAD:${source_branchs[index]}`, '--force'],
        {
          cwd: `./${project_names[index]}`
        }
      );
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
