const axios = require('axios').default;
var url = "www.dos.com"
var card_id = "mXzuCKKO"

// key and token taken from me later when you are going to change the code
//send all of the above the above variables as paramaters to this function
function create_attachment() {
  axios.post('https://api.trello.com/1/cards/'+ card_id + '/attachments', {
    url: url,
    key: key,
    token: token
  })
    .then(response => {
      if(response.status == 200) {
        console.log(response)
        return response.data
      }
    })
    .catch(err => console.error(err));
}


