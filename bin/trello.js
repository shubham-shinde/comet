import axios from "axios";
import chalk from "chalk";
import { selectPR, generatePRLink } from "./bitbucket";
import { getorCreateMainData, getORCreateCurrentBranchData } from "./storage";

// key and token taken from me later when you are going to change the code
//send all of the above the above variables as paramaters to this function

const getCardId = (url) => {
  return url.split("/")[4];
};

export const addNewPR = async () => {
  const key = await getorCreateMainData("trello", "key");
  const token = await getorCreateMainData("trello", "token");
  const cardUrl = await getORCreateCurrentBranchData("trello_card");
  const pull_request_ids = await selectPR({ multiple: true });
  for (let id in pull_request_ids) {
    let url = await generatePRLink(pull_request_ids[id]);
    await createAttachment({ url, key, token, card_id: getCardId(cardUrl) });
  }
};

export const createAttachment = async ({ url, key, token, card_id }) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards/${card_id}/attachments`,
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
