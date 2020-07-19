import inquirer from "inquirer";
import fs from "fs";
import { createPR } from "./bitbucket";
import { createAttachment } from "./trello";
import {
  currentBranch,
  getBranchName,
  createBranchFromMaster,
  getCardId,
} from "./gitLocal";

const baseDir = ".comet";
const tokenFilePath = ".comet/token.json";
const dataFilePath = ".comet/data.json";
const PRbranches = ["staging", "internal", "integration"];

export const createPRFromCurrrentBranch = async () => {
  if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, "{}");
  const rawData = fs.readFileSync(dataFilePath, "utf8");
  const branches = JSON.parse(rawData);
  const thisBranch = await currentBranch();
  if (!branches[thisBranch]) {
    console.error("current Branch does not exist");
    return;
  }
  let branchPR = branches[thisBranch].pr || {};
  const trelloCardUrl = branches[thisBranch].cardUrl;
  console.log(branches[thisBranch]);
  const branchNames = await askData("pullRequests", {
    type: "checkbox",
    display: "Pull Requests Destination branch",
    choices: () => PRbranches.map((pr) => ({ name: pr, value: pr, short: pr })),
  });
  const username = getData(tokenFilePath, "bitbucketUserName");
  const password = getData(tokenFilePath, "bitbucketPassword");
  const repo = getData(tokenFilePath, "repo");
  const workspace = getData(tokenFilePath, "workspace");
  const prs = await Promise.all(
    branchNames.map(async (destinationBranch) => {
      try {
        const { id, url } = await createPR({
          workspace,
          repo_slug: repo,
          username,
          password,
          originBranch: thisBranch,
          destinationBranch,
        });
        console.log(destinationBranch, "PR URL", url);
        return { id, url, toBranch: destinationBranch };
      } catch (err) {
        console.error("error creating pr for destinationBranch");
      }
    })
  );
  branchPR = {
    ...branchPR,
    ...(prs || []).reduce(
      (obj, item) => ({
        ...obj,
        [item.toBranch]: { ...item },
      }),
      {}
    ),
  };
  branches[thisBranch] = { ...branches[thisBranch], pr: { ...branchPR } };
  fs.writeFileSync(dataFilePath, JSON.stringify(branches));
  const key = getData(tokenFilePath, "trelloKey");
  const token = getData(tokenFilePath, "trelloToken");
  await Promise.all([
    prs.map(async ({ url }) => {
      const card_id = getCardId(trelloCardUrl);
      await createAttachment({ url, key, token, card_id });
    }),
  ]);
  console.log("Dan dana done............");
};

export const newCard = async () => {
  if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, "{}");
  const rawData = fs.readFileSync(dataFilePath, "utf8");
  const branches = JSON.parse(rawData) || {};
  const trelloCardUrl = await askData("TrollCard", {
    display: "Trello Card URL",
  });
  const name = getData(tokenFilePath, "name");
  let branchName = `${name}/${getBranchName(trelloCardUrl || "")}`;
  branchName = await askData("branchName", {
    display: "Branch Name",
    default: branchName,
  });
  branches[branchName] = {
    name: branchName,
    cardUrl: trelloCardUrl,
    pr: {},
  };
  console.log(branches);
  fs.writeFileSync(dataFilePath, JSON.stringify(branches));
  await createBranchFromMaster(branchName);
  console.log(`You Are On ${branchName}`);
};

export const startInit = async () => {
  createCometFiles();
  const credentials = {
    bitbucketUserName: await askAndSaveData(
      "bitbucketUserName",
      tokenFilePath,
      {
        display: "Bitbucket user name ?",
      }
    ),
    bitbucketPassword: await askAndSaveData(
      "bitbucketPassword",
      tokenFilePath,
      {
        display: "Bitbucket Password ?",
        type: "password",
      }
    ),
    trelloKey: await askAndSaveData("trelloKey", tokenFilePath, {
      display: "Trello Key ?",
    }),
    trelloToken: await askAndSaveData("trelloToken", tokenFilePath, {
      display: "Trello Auth Token ?",
    }),
    workspace: await askAndSaveData("workspace", tokenFilePath, {
      default: "gocomet",
      display: "Bitbucket Workspace ?",
    }),
    repo: await askAndSaveData("repo", tokenFilePath, {
      display: "Bitbucket Repo Slug ?",
      type: "list",
      choices: [
        { name: "frontend-service", value: "frontend-service" },
        { name: "gocomet-app", value: "gocomet-app" },
        { name: "gocomet-dashboard", value: "gocomet-dashboard" },
        { name: "gocomet-sidecar", value: "gocomet-sidecar" },
      ],
    }),
    name: await askAndSaveData("name", tokenFilePath, {
      display: "Name to add in branch (User Name) ?",
    }),
  };
  return credentials;
};

const createCometFiles = () => {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  if (!fs.existsSync(tokenFilePath)) {
    fs.writeFileSync(tokenFilePath, "{}");
  }
};

const askAndSaveData = async (credentialName, fileName, options = {}) => {
  const rawData = fs.readFileSync(fileName, "utf8");
  const credentials = JSON.parse(rawData);
  options.default = (options || {}).default || credentials[credentialName];
  credentials[credentialName] = await askData(credentialName, options);
  fs.writeFileSync(fileName, JSON.stringify(credentials));
  return credentials[credentialName];
};

const askData = async (credentialName, options) => {
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

const getData = (fileName, credentialName) => {
  const rawData = fs.readFileSync(fileName, "utf8");
  const credentials = JSON.parse(rawData);
  return credentials[credentialName];
};
