const inquirer = require('inquirer');
const fs = require('fs');

const baseDir = '.comet'
const tokenFilePath = '.comet/token.json';
const dataFilePath = '.comet/data.json';

const getRequiredData = async () => {
	createCometFiles();
	const credentials = {
		bitbucketUserName: await readOrAskData('bitbucketUserName', tokenFilePath),
		bitbucketPassword: await readOrAskData('bitbucketPassword', tokenFilePath),
		trelloKey: await readOrAskData('trelloKey', tokenFilePath),
		trelloToken: await readOrAskData('trelloToken', tokenFilePath),
		trelloLink: await readOrAskData('trelloLink', dataFilePath),
	}
	return credentials;
}

const createCometFiles = () => {
	if (!fs.existsSync(baseDir)){
		fs.mkdirSync(baseDir);
	}
	if (!fs.existsSync(tokenFilePath)){
		fs.writeFileSync(tokenFilePath, '{}');
	}
	if (!fs.existsSync(dataFilePath)){
		fs.writeFileSync(dataFilePath, '{}');
	}
}

const readOrAskData = async (credentialName, fileName) => {
	const rawData = fs.readFileSync(fileName, 'utf8');
	const credentials = JSON.parse(rawData);
	if (credentials[credentialName]) {
		return credentials[credentialName];
	} else {
		const answers = await inquirer.prompt([
			{ type: 'input', name: credentialName, message: 'Enter Your ' + credentialName }
		]).then(answers => {
			credentials[credentialName] = answers[credentialName];
			fs.writeFileSync(fileName, JSON.stringify(credentials));
			return answers;
		})
		return answers[credentialName];
	}
}
