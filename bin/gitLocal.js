import simpleGit from "simple-git";
import chalk from "chalk";
const git = simpleGit();

export const getBranchName = (url) =>
  url
    .split("/")
    .pop()
    .split("-")
    .filter(isNaN)
    .join("-");

export const createBranchFromMaster = async (branchName) => {
  console.log("checkout to master");
  await git.checkout("master");
  console.log("pulling new updates on master...");
  await git.pull("origin", "master");
  console.log("master updated.");
  await git.pull("origin", "master");
  console.log("checkout to new branch");
  await git.checkoutLocalBranch(branchName, "master");
  console.log(chalk.green("You are on", branchName));
};

export const isBranchPresent = async (branchName) => {
  let branches = await git.branchLocal();
  return branches.all.findIndex((branch) => branch == branchName) >= 0;
};

export const currentBranch = async () => {
  const list = await git.branch();
  return list.current;
};

export const deleteLocalBranch = async (branchName) => {
  await git.deleteLocalBranch(branchName);
};

export const getRemote = async () => {
  const list = await git.listRemote(["origin"]);
  console.log(list);
};
