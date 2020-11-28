export const BASE_DIR = "./.comet";
export const MAIN_FILE = `${BASE_DIR}/token.json`;
export const DATA_FILE = `${BASE_DIR}/data.json`;
export const INSTANT_MERGE_BRANCH = "integration";
export const TRELLO_ADD_BRANCHES = ["internal", "staging"];
export const INSTANT_PR_BRANCHES = [
  INSTANT_MERGE_BRANCH,
  ...TRELLO_ADD_BRANCHES,
];
export const PR_BRANCHES = [...INSTANT_PR_BRANCHES, "master", "qc"];
export const BITBUCKET_BASE = "https://api.bitbucket.org/2.0/";
export const TRELLO_BASE = "https://api.trello.com/1/";
export const WORKSPACE = "gocomet";
export const REPO_SLUGS = [
  "gocomet-app",
  "frontend-service",
  "gocomet-sidecar",
  "gocomet-dashboard",
];
export const MAIN_FILL = {
  bitbucket: {
    username: "",
    password: "",
    workspace: "",
    repo_slug: "",
  },
  trello: {
    key: "",
    token: "",
  },
  user: {
    name_slug: "",
  },
};

export const BRANCH_FILL = {
  trello_card: "",
  branch_name: "",
  pull_requests: {},
};
