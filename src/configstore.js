const ConfigStore = require("configstore");
const currentDir = process.cwd();
const config = new ConfigStore(`${currentDir}/Gocomet`)
config.set("shubham", 'me')
console.log(config.path)
