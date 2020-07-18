#!/usr/bin/env node
require("@babel/register")({
  ignore: [/node_modules\/(?!comet)/],
});
require("@babel/polyfill");
module.exports = require("./app");
