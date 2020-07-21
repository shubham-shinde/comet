import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import {
  startInit,
  newCard,
  addCurrentBranch,
  createPRFromCurrrentBranch,
} from "./main";

const workInProgress = "Work In Progress!!!!";

const argv = yargs
  .scriptName("comet")
  .usage("Usage: $0 <command> [options]")
  .command({
    // @params: bitbucketUserName, bitbucketPassword, trelloKey, trelloToken, name
    // @func: Create .comet in dir and Save data in token file
    command: "init",
    describe: "Init comet into repo",
    handler: async () => startInit(),
  })
  .command({
    command: "card",
    describe: "Trello Card related Actions",
    builder: (yargs) => {
      yargs
        .usage("Usage: $0 $1 <command>")
        .command({
          // @params: Trello card URL, Branch Name(Defautl give by trello link)
          // @func: Save Trello URL to data file and checkout to new branch from master
          command: "new",
          describe: "Checkout to new branch with Card URL",
          handler: () => createPRFromCurrrentBranch(),
        })
        .command({
          // @params: Trello Card URL
          // @func: Take current branch and add Trello Card URL to Current Branch
          command: "current",
          describe: "Current Branch will be add with Trello URL",
          handler: () => addCurrentBranch(),
        })
        .command({
          // @params:
          // @func: Open current Card URL on Browser
          command: "open",
          describe: "Open Current Trello card URL to browser",
          handler: async () => {
            // @shubham
            console.log("openCurrentTrelloURL", workInProgress);
          },
        })
        .command({
          command: "pr",
          describe: "pull request related actions",
          builder: (yargs) =>
            yargs
              .usage("Usage: $0 $1 $2 <command>")
              .command({
                // @params:
                // @func: List Pull request of current branch
                // @action: On client of andy PR it'll open on new branch
                command: "list",
                describe: "List of PR Added on card",
                handler: async () => {
                  // @chirag
                  console.log("listCurrentPrOfCard", workInProgress);
                },
              })
              .command({
                // @params: PR to add
                // @func: List PR Available, Add selected PR to current card
                // @action: Select Available PR
                command: "new",
                describe: "Add new PR to current card",
                handler: async () => {
                  // @chirag
                  console.log("addCurrentCardPR", workInProgress);
                },
              }),
        });
    },
  })
  .command({
    command: "pr",
    alias: ["pull_request"],
    describe: "Pull Request related Actions",
    builder: (yargs) => {
      yargs
        .usage("Usage: $0 $1 $2 <command>")
        .command({
          // @params: PR target branch
          // @func: Create PR of selected Branch from Current branch and Save to data file
          command: "new",
          describe: "Createn new PR",
          handler: async (yargs) => {
            // @shubham
            await createPRFromCurrrentBranch();
          },
        })
        .command({
          // @parmas:
          // @func: List Current Branch PR (all)
          // @action: Click to copy or open
          command: "list",
          describe:
            "List all the PR from current branch, On Click ask to copy to clipboard or open on browser",
          handler: async (yargs) => {
            // @jitendra
            console.log("listPR", workInProgress);
          },
        })
        .command({
          // @parmas: PR to Merge
          // @func: List Current Branch PR (all), And Merge Selected PRs
          // @action: Click to Merge
          // @error: Throw error if user don't have permission to merge
          command: "merge",
          describe: "Select PR to Merge",
          handler: async (yargs) => {
            // @jitendra
            console.log("mergePR", workInProgress);
          },
        })
        .command({
          // @parmas: PR to Decline
          // @func: List Current Branch PR (all), And Decline Selected PRs
          // @action: Click to Decline
          // @error: Throw error if user don't have permission to decline
          command: "decline",
          describe: "Select PR to decline",
          handler: async (yargs) => {
            // @jitendra
            console.log("declinePR", workInProgress);
          },
        });
    },
  })
  .help("h")
  .alias("h", "help")
  .epilog("copyright 2020").argv;
