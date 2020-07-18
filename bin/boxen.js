"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _boxen = _interopRequireDefault(require("boxen"));

var _yargs = _interopRequireDefault(require("yargs"));

var _simpleGit = _interopRequireDefault(require("simple-git"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var git = (0, _simpleGit["default"])();

var getBranchName = function getBranchName(url) {
  return url.split("/").pop().split("-").filter(isNaN).join("-");
};

var options = _yargs["default"].command("new").usage("Usage: -u <url>").usage("Usage: -n <name>").options("u", {
  alias: "url",
  describe: "Trello Card Url",
  type: "string",
  demandOption: true
}).options("n", {
  alias: "name",
  describe: "Your first name",
  type: "string",
  demandOption: true
}).argv;

var greeting = _chalk["default"].white.bold("".concat(options.name, "/").concat(getUrl(options.url)));

var boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
  backgroudColor: "#555555"
};
var msgBox = (0, _boxen["default"])(greeting, boxenOptions);
console.log(msgBox);