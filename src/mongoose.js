#!/usr/bin/env node

const inquirer  = require('./inquirer');
const configstore = require("./configstore");

const run = async () => {
	const credentials = await inquirer.askGithubCredentials();
	console.log(credentials);
};

run();


