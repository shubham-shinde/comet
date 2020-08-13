export const BASE_DIR = "./.comet";
export const MAIN_FILE = `${BASE_DIR}/token.json`;
export const DATA_FILE = `${BASE_DIR}/data.json`;
export const PR_BRANCHES = ["integration", "internal", "staging", "master"];
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
