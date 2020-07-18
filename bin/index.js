#!/usr/bin/env node
"use strict";

require("@babel/register")({
  ignore: [/node_modules\/(?!comet)/]
});

module.exports = require("./app");