import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import { getBranchName } from "./gitLocal";
import { startInit, newCard } from "./dataStore";

const argv = yargs
  .usage("Usage: $0 <command> [options]")
  .command("init", "Init comet into repo", async (yargs) => {
    const argv = yargs.usage("usage: $0 init").wrap(null).argv;
    checkCommands(yargs, argv, 0);
    startInit();
  })
  .command("new", "create a branch", async (yargs) => {
    const argv = yargs.usage("usage: $0 new").wrap(null).argv;
    checkCommands(yargs, argv, 0);
    await newCard();
  })
  .command("pr", "create pr", (yargs) => {
    const argv = yargs.usage("usage: $0 pr <url> [options]").wrap(null).argv;
    checkCommands(yargs, argv, 1);
    const trelloCardUrl = argv._[1];
    const greeting = chalk.white.bold(
      `${argv.name}/${getBranchName(trelloCardUrl || "")}`
    );
    //this is branch_name
    //create new brach from master branch
  }).argv;

function checkCommands(yargs, argv, numRequired) {
  if (argv._.length < numRequired) {
    yargs.showHelp();
  }
}
