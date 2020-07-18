import simpleGit from "simple-git";
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
  console.log("you are on");
};
