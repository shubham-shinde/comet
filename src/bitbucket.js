import { Bitbucket } from "bitbucket";

export const createPR = async (
  username,
  password,
  originBranch,
  destinationBranch
) => {
  try {
    const workspace = "gocomet";
    const repo_slug = "gocomet-app";
    const clientOptions = {
      auth: {
        username: username,
        password: password,
      },
    };
    const bitbucket = new Bitbucket(clientOptions);

    const body = {
      title: "master to staging",
      source: {
        branch: {
          name: originBranch,
        },
      },
      destination: {
        branch: {
          name: destinationBranch,
        },
      },
    };

    const { data, headers } = await bitbucket.repositories.createPullRequest({
      _body: body,
      repo_slug,
      workspace,
    });
    return {
      id: data.id,
      url: data.links.self.href,
    };
  } catch (err) {
    console.log("bitbucket error", err);
  }
};

