import simpleGit from "simple-git";
const git = simpleGit();

export const getBranchName = (url) =>
  url
    .split("/")
    .pop()
    .split("-")
    .filter(isNaN)
    .join("-");

export const createBranchFromMaster = (branchName) => {
  git.checkoutLocalBranch(branchName, "origin/master");
};
