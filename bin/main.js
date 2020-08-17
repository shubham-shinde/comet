import inquirer from "inquirer";
import fs from "fs";
import chalk from "chalk";
import figlet from "figlet";
import { createPR } from "./bitbucket";
import { createAttachment } from "./trello";
import {
  getORCreateCurrentBranchData,
  getorCreateMainData,
  createOrUpdateBranch,
} from "./storage";
import {
  currentBranch,
  getBranchName,
  createBranchFromMaster,
  isBranchPresent,
  deleteLocalBranch,
} from "./gitLocal";

export const newCard = async () => {
  const trelloCardUrl = await askData("TrollCard", {
    display: "Trello Card URL",
  });
  const name = await getorCreateMainData("user", "name_slug");
  let branchName = `${name}/${getBranchName(trelloCardUrl || "")}`;
  branchName = await askData("branchName", {
    display: "Branch Name",
    default: branchName,
  });
  while (await isBranchPresent(branchName)) {
    console.log(chalk.red("current branch is available"));
    const remove = await askData("Yes to Delete Current Branch?", {
      type: "confirm",
    });
    remove
      ? await deleteLocalBranch(branchName)
      : (branchName = await askData("branchName", {
          display: "Branch Name",
          default: branchName,
        }));
  }
  await createBranchFromMaster(branchName);
  createOrUpdateBranch(branchName, { trello_card: trelloCardUrl, ask: true });
};

export const startInit = async () => {
  figlet.text("COMET", (err, data) => console.log(data));
  await getorCreateMainData("bitbucket", "username", true);
  await getorCreateMainData("bitbucket", "password", true);
  await getorCreateMainData("bitbucket", "workspace", true);
  await getorCreateMainData("bitbucket", "repo_slug", true);
  await getorCreateMainData("user", "name_slug", true);
  await getorCreateMainData("trello", "key", true);
  await getorCreateMainData("trello", "token", true);
  console.log(chalk.green("Congrats!! Comet setup is done"));
};

export const askData = async (credentialName, options) => {
  const { type, choices, display } = options || {};
  const answers = await inquirer.prompt([
    {
      type: type || "input",
      name: credentialName,
      message: display || `Enter Your ${credentialName} : `,
      default: (options || {}).default,
      choices,
      validate: (value) => (value ? true : false),
    },
  ]);
  return answers[credentialName];
};
