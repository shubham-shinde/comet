"use strict";

var ConfigStore = require("configstore");

var currentDir = process.cwd();
var config = new ConfigStore("".concat(currentDir, "/Gocomet"));
config.set("shubham", 'me');
console.log(config.path);