import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import { getBranchName, createBranchFromMaster } from "./gitLocal";

const argv = yargs
  .usage("Usage: $0 <command> [options]")
  .command("new", "create a branch", (yargs) => {
    const argv = yargs
      .usage("usage: $0 new <url> [options]")
      .options("n", {
        alias: "name",
        describe: "Your first name",
        type: "string",
        demandOption: true,
        require: true,
      })
      .options("b", {
        alias: "bname",
        alias: "branch_name",
        describe: "Custom Branch name for card",
        type: "string",
      })
      .wrap(null).argv;
    checkCommands(yargs, argv, 2);
    const trelloCardUrl = argv._[1];
    const branch_name =
      argv.branch_name === undefined
        ? `${argv.name}/${getBranchName(trelloCardUrl || "")}`
        : argv.branch_name;
    console.log(branch_name, argv.branch_name);
    const greeting = chalk.white.bold(branch_name);
    const msgBox = boxen(argv.bname || greeting);
    //this is branch_name
    //create new brach from master branch
    createBranchFromMaster(branch_name);
    console.log(msgBox);
  })
  .command("pr", "create pr", (yargs) => {
    const argv = yargs.usage("usage: $0 pr <url> [options]").wrap(null).argv;
    checkCommands(yargs, argv, 1);
    const trelloCardUrl = argv._[1];
    const greeting = chalk.white.bold(
      `${argv.name}/${getBranchName(trelloCardUrl || "")}`
    );
    const msgBox = boxen(argv.bname || greeting);
    //this is branch_name
    //create new brach from master branch
    console.log(msgBox);
  }).argv;

function checkCommands(yargs, argv, numRequired) {
  if (argv._.length < numRequired) {
    yargs.showHelp();
  }
}
