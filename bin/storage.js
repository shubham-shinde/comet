import inquirer from "inquirer";
import opn from "opn";
import { promisify } from "util";
import chalk from "chalk";
import fs from "fs";
import { askData } from "./main";
import { createPR } from "./bitbucket";
import { createAttachment } from "./trello";
import { currentBranch } from "./gitLocal";
import {
  BASE_DIR,
  MAIN_FILE,
  DATA_FILE,
  PR_BRANCHES,
  BRANCH_FILL,
  TOKEN_FILL,
  MAIN_FILL,
  REPO_SLUGS,
  WORKSPACE,
} from "./setting";

const fileExist = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

export const getORCreateCurrentBranchData = async (
  data_name,
  branch_name = null
) => {
  const file = await getFile(DATA_FILE);
  const thisBranch = branch_name ? branch_name : await currentBranch();
  if (!file[thisBranch]) {
    file[thisBranch] = { ...BRANCH_FILL, branch_name: thisBranch };
  }
  if (!(file[thisBranch] || {})[data_name]) {
    file[thisBranch][data_name] = await askData(data_name);
  }
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(file));
  return file[thisBranch][data_name];
};

export const createOrUpdateBranch = async (
  branch_name,
  { trello_card = undefined, pull_requests = {}, ask = false }
) => {
  branch_name = branch_name || (await currentBranch());
  const file = await getFile(DATA_FILE);
  if (file[branch_name] && ask) {
    if (!askData("file_already_exist_yes_to_continue", { type: "confirm" })) {
      console.log(chalk.red("aborting.................."));
      process.exit(1);
    }
  }
  file[branch_name] = {
    ...file[branch_name],
    branch_name: branch_name,
  };
  if (trello_card) file[branch_name]["trello_card"] = trello_card;
  if (pull_requests) file[branch_name]["pull_requests"] = pull_requests;
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(file));
};

export const getorCreateMainData = async (
  from,
  data_name = null,
  update = false
) => {
  const file = await getFile(MAIN_FILE);
  if (!file[from]) {
    file[from] = { ...MAIN_FILL[from] };
  }
  if (data_name && (!(file[from] || {})[data_name] || update)) {
    file[from][data_name] = await askData(
      `${from}_${data_name}`,
      optionsForData(from, data_name, (file[from] || {})[data_name])
    );
  }
  await fs.promises.writeFile(MAIN_FILE, JSON.stringify(file));
  return data_name ? file[from][data_name] : file[from];
};

const getFile = async (file_path) => {
  const file_exist = await fileExist(file_path);
  if (!file_exist) {
    await mkdir(BASE_DIR, { recursive: true });
    await fs.promises.writeFile(file_path, "{}");
  }
  return JSON.parse(await fs.promises.readFile(file_path));
};

const optionsForData = (from, data_name = null, initial = null) => {
  const options = {
    default: initial,
    type: null,
    display: null,
    choices: null,
  };
  if (data_name === "password" || data_name === "token") {
    options.type = "password";
  }
  if (data_name === "repo_slug") {
    options.type = "list";
    options.choices = REPO_SLUGS;
  }
  if (data_name === "workspace") {
    options.default = WORKSPACE;
  }
  return options;
};

export const openCurrentCard = async () => {
  opn(await getORCreateCurrentBranchData("trello_card"));
};
