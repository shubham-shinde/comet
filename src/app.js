import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import { startInit, newCard, createPRFromCurrrentBranch } from "./dataStore";

const argv = yargs
  .usage("Usage: $0 <command> [options]")
  .command({
    command: "init",
    describe: "Init comet into repo",
    handler: async (yargs) => {
      startInit();
    },
  })
  .command({
    command: "new",
    describe: "create a branch",
    handler: async (yargs) => {
      await newCard();
    },
  })
  .command({
    command: "pr",
    describe: "pull request",
    builder: (yargs) => {
      yargs.command({
        command: "new",
        describe: "Createn new PR",
        handler: async (yargs) => {
          createPRFromCurrrentBranch();
        },
      });
    },
  }).argv;

function checkCommands(yargs, argv, numRequired) {
  if (argv._.length < numRequired) {
    yargs.showHelp();
  }
}
