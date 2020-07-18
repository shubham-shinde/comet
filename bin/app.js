"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _boxen = _interopRequireDefault(require("boxen"));

var _yargs = _interopRequireDefault(require("yargs"));

var _gitLocal = require("./gitLocal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var argv = _yargs["default"].usage("Usage: $0 <command> [options]").command("new", "create a branch", function (yargs) {
  var _yargs$usage$options$;

  var argv = yargs.usage("usage: $0 new <url> [options]").options("n", {
    alias: "name",
    describe: "Your first name",
    type: "string",
    demandOption: true,
    require: true
  }).options("b", (_yargs$usage$options$ = {
    alias: "bname"
  }, _defineProperty(_yargs$usage$options$, "alias", "branch_name"), _defineProperty(_yargs$usage$options$, "describe", "Custom Branch name for card"), _defineProperty(_yargs$usage$options$, "type", "string"), _yargs$usage$options$)).wrap(null).argv;
  checkCommands(yargs, argv, 2);
  var trelloCardUrl = argv._[1];
  var branch_name = argv.branch_name === undefined ? "".concat(argv.name, "/").concat((0, _gitLocal.getBranchName)(trelloCardUrl || "")) : argv.branch_name;
  console.log(branch_name, argv.branch_name);

  var greeting = _chalk["default"].white.bold(branch_name);

  var msgBox = (0, _boxen["default"])(argv.bname || greeting); //this is branch_name
  //create new brach from master branch

  (0, _gitLocal.createBranchFromMaster)(branch_name);
  console.log(msgBox);
}).command("pr", "create pr", function (yargs) {
  var argv = yargs.usage("usage: $0 pr <url> [options]").wrap(null).argv;
  checkCommands(yargs, argv, 1);
  var trelloCardUrl = argv._[1];

  var greeting = _chalk["default"].white.bold("".concat(argv.name, "/").concat((0, _gitLocal.getBranchName)(trelloCardUrl || "")));

  var msgBox = (0, _boxen["default"])(argv.bname || greeting); //this is branch_name
  //create new brach from master branch

  console.log(msgBox);
}).argv;

function checkCommands(yargs, argv, numRequired) {
  if (argv._.length < numRequired) {
    yargs.showHelp();
  }
}