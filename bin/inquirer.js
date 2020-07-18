"use strict";

var inquirer = require('inquirer');

module.exports = {
  askGithubCredentials: function askGithubCredentials() {
    var questions = [{
      name: 'first name',
      type: 'input',
      message: 'Enter Your Name to add in branch name:',
      validate: function validate(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please Enter Your Name to add in branch name:';
        }
      }
    }];
    return inquirer.prompt(questions);
  }
};