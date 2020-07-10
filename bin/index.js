#!/usr/bin/env node

const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require('yargs')

const getUrl = url => url.split('/').pop().split('-').filter(isNaN).join('-')

const options = yargs
	.usage('Usage: -u <url>')
	.usage('Usage: -n <name>')
	.options('u', {alias: 'url', describe: 'Trello Card Url', type: 'string', demandOption: true})
	.options('n', {alias: 'name', describe: 'Your first name', type: 'string', demandOption: true})
	.argv;

const greeting = chalk.white.bold(`${options.name}/${getUrl(options.url)}`);

const boxenOptions = {
	padding: 1,
	margin: 1,
	borderStyle: "round",
	borderColor: "green",
	backgroudColor: '#555555',
}

const msgBox = boxen( greeting, boxenOptions )

console.log(msgBox);
