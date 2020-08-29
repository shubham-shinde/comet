import { getorCreateMainData } from "./storage";
import { currentBranch } from "./gitLocal";
import open from "opn";

export const openTest = async () => {
  const branch_name = await currentBranch();
  const repo_slug = await getorCreateMainData("bitbucket", "repo_slug");
  const url = `https://jenkins.gocomet.com/job/${repo_slug}/job/${branch_name.replace(
    "/",
    "%252F"
  )}/`;
  open(url);
};
