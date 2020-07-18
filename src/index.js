#!/usr/bin/env node
require("@babel/register")({
  ignore: [/node_modules\/(?!comet)/],
});
module.exports = require("./app");
