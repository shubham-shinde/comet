import axios from "axios";

// key and token taken from me later when you are going to change the code
//send all of the above the above variables as paramaters to this function
export const createAttachment = ({ url, key, token, card_id }) => {
  try {
    return axios
      .post("https://api.trello.com/1/cards/" + card_id + "/attachments", {
        url: url,
        key: key,
        token: token,
      })
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        }
      });
  } catch (err) {
    console.error("error attaching PRs to trello card", err);
  }
};
