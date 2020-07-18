"use strict";

var _require = require('bitbucket'),
    Bitbucket = _require.Bitbucket; // const bitbucket = new Bitbucket()
// const token =


function authorise(username, password) {
  var clientOptions = {
    auth: {
      username: username,
      password: password
    }
  };
  var bitbucket = new Bitbucket(clientOptions);
  console.log(bitbucket);
  return bitbucket;
}

;
var username = 'apurv.pandey@gocomet.in';
var password = '';
var a = authorise(username, password);
console.log(a);