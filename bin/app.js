import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import {
  createPR,
  PRList,
  mergePR,
  declinePR,
  getPR,
  copyPR,
  openPR,
} from "./bitbucket";
import { addNewPR, getCheckList, cardDetails } from "./trello";
import {
  startInit,
  newCard,
  addCurrentBranch,
  createPRFromCurrrentBranch,
} from "./main";
import { openCurrentCard } from "./storage";

const workInProgress = "Work In Progress!!!!";

const argv = yargs
  .scriptName("comet")
  .usage("Usage: $0 <command> [options]")
  .command({
    // @params: bitbucketUserName, bitbucketPassword, trelloKey, trelloToken, name
    // @func: Create .comet in dir and Save data in token file
    command: "init",
    describe: "Init comet into repo",
    handler: startInit,
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
          handler: newCard,
        })
        .usage("Usage: $0 $1 <command>")
        .command({
          // @params: Trello card URL
          // @func: Show all the required details of the card
          command: ["show", "details"],
          describe: "Shows All the details of the card",
          handler: cardDetails,
        })
        .command({
          // @params:
          // @func: Show Checklist of the card
          // @action: User Can update checklist
          command: ["checklist", "cl"],
          describe: "Current Card Checklist",
          handler: getCheckList,
        })
        .command({
          // @params:
          // @func: Open current Card URL on Browser
          command: ["open", "o"],
          describe: "Open Current Trello card URL to browser",
          handler: openCurrentCard,
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
                handler: PRList,
              })
              .command({
                // @params: PR to add
                // @func: List PR Available, Add selected PR to current card
                // @action: Select Available PR
                command: "new",
                describe: "Add new PR to current card",
                handler: addNewPR,
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
          handler: createPR,
        })
        .command({
          // @parmas:
          // @func: List Current Branch PR (all)
          // @action: Click to copy or open
          command: "show",
          describe:
            "show all the PR from current branch, On Click shows the give details of the pr",
          handler: getPR,
        })
        .command({
          // @parmas:
          // @func: List Current Branch PR (all)
          // @action: Click to copy or open
          command: "copy",
          describe:
            "show all the PR from current branch, On Click ask to copy to clipboard or open on browser",
          handler: copyPR,
        })
        .command({
          // @parmas:
          // @func: List Current Branch PR (all)
          // @action: Click to copy or open
          command: "open",
          describe:
            "show all the PR from current branch, On Click ask to open PR in default browser",
          handler: openPR,
        })
        .command({
          // @parmas: PR to Merge
          // @func: List Current Branch PR (all), And Merge Selected PRs
          // @action: Click to Merge
          // @error: Throw error if user don't have permission to merge
          command: "merge",
          describe: "Select PR to Merge",
          handler: mergePR,
        })
        .command({
          // @parmas: PR to Decline
          // @func: List Current Branch PR (all), And Decline Selected PRs
          // @action: Click to Decline
          // @error: Throw error if user don't have permission to decline
          command: "decline",
          describe: "Select PR to decline",
          handler: declinePR,
        });
    },
  })
  .help("h")
  .alias("h", "help")
  .epilog("copyright 2020").argv;
