const { Bitbucket } = require('bitbucket')
// const bitbucket = new Bitbucket()
// const token =

function authorise(username, password) {
  const clientOptions = {
    auth: {
      username: username,
      password: password,
    },
  }
  const bitbucket = new Bitbucket(clientOptions)
  console.log(bitbucket)
  return bitbucket
};

var username = 'apurv.pandey@gocomet.in'
var password = ''

var a = authorise(username, password)
console.log(a)
