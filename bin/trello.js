import axios from "axios";
import chalk from "chalk";
import { TRELLO_BASE } from "./setting";
import { selectPR, generatePRLink } from "./bitbucket";
import { getorCreateMainData, getORCreateCurrentBranchData } from "./storage";

// key and token taken from me later when you are going to change the code
//send all of the above the above variables as paramaters to this function

const getCardId = (url) => {
  return url.split("/")[4];
};

export const cardDetails = async () => {
  const key = await getorCreateMainData("trello", "key");
  const token = await getorCreateMainData("trello", "token");
  const cardUrl = await getORCreateCurrentBranchData("trello_card");
  const card_details = await getCard({
    key,
    token,
    card_id: getCardId(cardUrl),
  });
  console.log(chalk.bold("Name:"), card_details.name);
  console.log(
    chalk.bold("Labels:"),
    card_details.labels
      .map((label) => chalk.keyword(label.color || "white")(label.name))
      .join(", ")
  );
  console.log(chalk.bold("Current List:"), card_details.list.name);
  console.log(chalk.bold("Description:"), card_details.desc);
  console.log(
    chalk.bold("Due Date:"),
    new Date(card_details.due).toLocaleString()
  );
  console.log(
    chalk.bold("Members:"),
    card_details.members.map((member) => member.fullName).join(", ")
  );
  console.log(chalk.yellow("\nChecklists ------------------------"));
  showChecklist(card_details.checklists);
  console.log(chalk.yellow("\nAttachments ------------------------"));
  showAttachments(card_details.attachments);
};

export const getCheckList = async () => {
  const key = await getorCreateMainData("trello", "key");
  const token = await getorCreateMainData("trello", "token");
  const cardUrl = await getORCreateCurrentBranchData("trello_card");
  const card_details = await getCard({
    key,
    token,
    card_id: getCardId(cardUrl),
  });
  showChecklist(card_details.checklists);
};

const showAttachments = (attachments) => {
  const prReg = /bitbucket.+pull-requests/;
  attachments.forEach(async (attachment) => {
    console.log(`   ${attachment.url || attachment.name}`);
  });
};

const showChecklist = (checklists) => {
  checklists.forEach((checklist) => {
    console.log(chalk.bold(checklist.name), "-> ");
    const items = checklist.checkItems;
    for (let i in items)
      console.log(
        items[i].state === "complete"
          ? chalk.green(`   ${items[i].name}`)
          : `   ${items[i].name}`
      );
  });
};

export const addNewPR = async (_, ids = null) => {
  const key = await getorCreateMainData("trello", "key");
  const token = await getorCreateMainData("trello", "token");
  const cardUrl = await getORCreateCurrentBranchData("trello_card");
  const pull_request_ids = ids || (await selectPR({ multiple: true }));
  for (let id in pull_request_ids) {
    let url = await generatePRLink(pull_request_ids[id]);
    // TODO check is pr is already present
    await createAttachment({ url, key, token, card_id: getCardId(cardUrl) });
  }
  console.log(chalk.green("Pull Request added to Card"));
};

export const createAttachment = async ({ url, key, token, card_id }) => {
  try {
    const response = await axios.post(
      `${TRELLO_BASE}cards/${card_id}/attachments`,
      {
        url: url,
        key: key,
        token: token,
      }
    );
    if (response.status == 200) {
      return response.data;
    } else throw "error";
  } catch (err) {
    const error = ((err || {}).response || {}).data;
    console.log(
      chalk.redBright(error || "Error attaching PRs to trello card, Try Manual")
    );
  }
};

export const getCard = async ({ key, token, card_id }) => {
  try {
    const response = await axios.get(`${TRELLO_BASE}cards/${card_id}`, {
      params: {
        key: key,
        token: token,
        checklists: "all",
        attachments: true,
        list: true,
        members: true,
      },
    });
    if (response.status == 200) {
      return response.data;
    } else throw "error";
  } catch (err) {
    const error = ((err || {}).response || {}).data;
    console.log(
      chalk.redBright(error || "Error attaching PRs to trello card, Try Manual")
    );
  }
};
