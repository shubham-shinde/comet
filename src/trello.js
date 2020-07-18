const axios = require('axios').default;
var url = "www.dos.com"
var card_id = "mXzuCKKO"
var key = "4533fe0499c529cf52498f57a7bb2cc6"
var token = "f8d3591096b170bd34510a46cce7b1e17c66cd1a8c16d5808d0c3dd68ad60b3b"

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


