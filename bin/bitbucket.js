import { Bitbucket } from "bitbucket";
import chalk from "chalk";
import copy from "clipboardy";
import opn from "opn";
import { PR_BRANCHES } from "./setting";
import {
  getORCreateCurrentBranchData,
  getorCreateMainData,
  createOrUpdateBranch,
} from "./storage";
import { askData } from "./main";

export const getPR = async () => {
  const selectedPRID = await selectPR();
  const prData = await getPullRequest(selectedPRID);
  console.log(prData.links.html.href);
  console.log(chalk.bold("Origin Branch :"), prData.source.branch.name);
  console.log(
    chalk.bold("Destination Branch :"),
    prData.destination.branch.name
  );
  console.log(chalk.bold("State :"), prData.state);
  console.log(chalk.bold("Comment Count :"), prData.comment_count);
  console.log("\n");
};

export const copyPR = async () => {
  const selectedPRID = await selectPR();
  copy.writeSync(await generatePRLink(selectedPRID));
  console.log("Selected PR is Copied to Clipboard");
};

export const openPR = async () => {
  const selectedPRID = await selectPR();
  opn(await generatePRLink(selectedPRID));
};

export const declinePR = async () => {
  const selectedPRID = await selectPR();
  await declinePullRequest(selectedPRID);
};

export const mergePR = async () => {
  const selectedPRID = await selectPR();
  await mergePullRequest(selectedPRID);
};

const bitbucketAuth = async () => {
  const username = await getorCreateMainData("bitbucket", "username");
  const password = await getorCreateMainData("bitbucket", "password");
  const auth = { username: username, password: password };
  return new Bitbucket({ auth });
};

export const PRList = async () => {
  const selectedPRID = await selectPR();
  if (selectedPRID) {
    copy.writeSync(await generatePRLink(selectedPRID));
    console.log(chalk.green("Pull request is Copied to Clipboard 😎"));
  } else console.log(chalk.yellow("No pull request available!!"));
};

export const createPR = async () => {
  const originBranch = await getORCreateCurrentBranchData("branch_name");
  const workspace = await getorCreateMainData("bitbucket", "workspace");
  const repo_slug = await getorCreateMainData("bitbucket", "repo_slug");
  const trello_card = await getORCreateCurrentBranchData("trello_card");
  const branchNames = await askData("pull_requests", {
    type: "checkbox",
    display: "Pull Requests Destination branches",
    choices: () =>
      PR_BRANCHES.map((pr) => ({ name: pr, value: pr, short: pr })),
  });
  if (!branchNames.length) {
    console.log(chalk.yellow("Select atleast one destination branch"));
    process.exit(1);
  }
  const title = await askData("title", { default: originBranch });
  const description = await askData("description", {
    type: "editor",
    default: `card URL - ${trello_card}`,
  });
  console.log("Pull request initiated for", branchNames.join(", "));
  const prs = await getORCreateCurrentBranchData("pull_requests");
  for (let i in branchNames) {
    const body = {
      title,
      source: { branch: { name: originBranch } },
      destination: { branch: { name: branchNames[i] } },
      description,
    };
    const pr_data = await bitbucketPrCreator(body, repo_slug, workspace);
    prs[branchNames[i]] = (pr_data || {}).id;
  }
  await createOrUpdateBranch(originBranch, { pull_requests: prs });
};

export const selectPR = async ({ multiple = false } = {}) => {
  const pull_requests = await getORCreateCurrentBranchData("pull_requests");
  if (pull_requests && JSON.stringify(pull_requests) != "{}") {
    return await askData("pull_requests", {
      type: multiple ? "checkbox" : "list",
      choices: await Promise.all(
        Object.entries(pull_requests || {}).map(async ([short, value]) => ({
          name: `${await generatePRLink(value)} - ${short}`,
          short,
          value,
        }))
      ),
      display: "Select to copy pull request to clipboard",
    });
  } else {
    console.log("No Pull Request is available!");
    process.exit(1);
  }
};

const getPullRequest = async (id) => {
  try {
    const bitbucket = await bitbucketAuth();
    const workspace = await getorCreateMainData("bitbucket", "workspace");
    const repo_slug = await getorCreateMainData("bitbucket", "repo_slug");
    const { data, headers } = await bitbucket.repositories.getPullRequest({
      pull_request_id: id,
      repo_slug,
      workspace,
    });
    return data;
  } catch (err) {
    let errors = (((err || {}).error || {}).error || {}).message;
    console.log(err);
    console.log(
      chalk.redBright(errors || "Error while Merging PR try manual approch")
    );
    process.exit(1);
  }
};

const mergePullRequest = async (id) => {
  try {
    const bitbucket = await bitbucketAuth();
    const workspace = await getorCreateMainData("bitbucket", "workspace");
    const repo_slug = await getorCreateMainData("bitbucket", "repo_slug");
    const { data, headers } = await bitbucket.repositories.mergePullRequest({
      pull_request_id: id,
      repo_slug,
      workspace,
    });
    console.log(chalk.green("Select Pull Request is Merged 😋"));
  } catch (err) {
    let errors = (((err || {}).error || {}).error || {}).message;
    console.log(
      chalk.redBright(errors || "Error while Merging PR try manual approch")
    );
  }
};

const declinePullRequest = async (id) => {
  try {
    const bitbucket = await bitbucketAuth();
    const workspace = await getorCreateMainData("bitbucket", "workspace");
    const repo_slug = await getorCreateMainData("bitbucket", "repo_slug");
    const { data, headers } = await bitbucket.repositories.declinePullRequest({
      pull_request_id: id,
      repo_slug,
      workspace,
    });
    console.log(chalk.green("Select Pull Request is Declined 🙄"));
  } catch (err) {
    let errors = (((err || {}).error || {}).error || {}).message;
    console.log(
      chalk.redBright(errors || "Error while Declining PR try manual approch")
    );
  }
};

export const generatePRLink = async (id) => {
  const workspace = await getorCreateMainData("bitbucket", "workspace");
  const repo_slug = await getorCreateMainData("bitbucket", "repo_slug");
  return `https://bitbucket.org/${workspace}/${repo_slug}/pull-requests/${id}`;
};

export const bitbucketPrCreator = async (body, repo_slug, workspace) => {
  try {
    const bitbucket = await bitbucketAuth();
    const { data, headers } = await bitbucket.repositories.createPullRequest({
      _body: body,
      repo_slug,
      workspace,
    });
    console.log(
      "Pull Request for",
      body.destination.branch.name,
      chalk.green((data || {}).links.html.href)
    );
    return {
      id: data.id,
      url: data.links.html.href,
    };
  } catch (err) {
    const error = (((err || {}).error || {}).error || {}).message;
    console.log(
      chalk.yellow(error || `Error while creating pull request for`),
      chalk.red(
        `Branch ${body.source.branch.name} -> ${body.destination.branch.name} Error`
      )
    );
    console.log(
      chalk.yellow(`Try manually, Use this link - `),
      chalk.blue(
        `https://bitbucket.org/${workspace}/${repo_slug}/pull-requests/new?source=${body.source.branch.name}`
      )
    );
  }
};

export const PRID = (link) => {
  return link.split("/")[6];
};
