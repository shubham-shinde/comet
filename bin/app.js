import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import {
  startInit,
  newCard,
  addCurrentBranch,
  createPRFromCurrrentBranch,
} from "./main";

const argv = yargs
  .scriptName("comet")
  .usage("Usage: $0 <command> [options]")
  .command({
    command: "init",
    describe: "Init comet into repo",
    handler: async (yargs) => {
      startInit();
    },
  })
  .command({
    command: "current",
    describe: "Add current branch",
    handler: async (yargs) => {
      await addCurrentBranch();
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
    alias: ["pull_request"],
    describe: "Handle Pull Request related Tasks",
    builder: (yargs) => {
      yargs
        .usage("Usage: $0 $1 <command>")
        .command({
          command: "new",
          describe: "Createn new PR",
          handler: async (yargs) => {
            await createPRFromCurrrentBranch();
          },
        })
        .command({
          command: "list",
          describe:
            "List all the PR from current branch, On Click of any PR It'll ask to copy to clipboard or open on browser",
          handler: async (yargs) => {
            //list all PR from this branch
            //On Click Ask to Open or Copy Link to Clipboard
          },
        });
    },
  })
  .help("h")
  .alias("h", "help")
  .epilog("copyright 2020").argv;
