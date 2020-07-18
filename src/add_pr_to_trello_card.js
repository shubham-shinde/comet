const fetch = require('node-fetch');
var url = "www.result.com"
var card_id = "rftduysZ"
var key = "4533fe0499c529cf52498f57a7bb2cc6"
var token = "f8d3591096b170bd34510a46cce7b1e17c66cd1a8c16d5808d0c3dd68ad60b3b"

fetch('https://api.trello.com/1/cards/'+ card_id + '/attachments?key=' + key + '&token='+ token +'&&url='+ url, {
  method: 'POST',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => {
    if(response.status == 200) {
      return response.text
    }
  })
  .catch(err => console.error(err));
