"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBranchFromMaster = exports.getBranchName = void 0;

var _simpleGit = _interopRequireDefault(require("simple-git"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var git = (0, _simpleGit["default"])();

var getBranchName = function getBranchName(url) {
  return url.split("/").pop().split("-").filter(isNaN).join("-");
};

exports.getBranchName = getBranchName;

var createBranchFromMaster = function createBranchFromMaster(branchName) {
  git.checkoutLocalBranch(branchName, "origin/master");
};

exports.createBranchFromMaster = createBranchFromMaster;