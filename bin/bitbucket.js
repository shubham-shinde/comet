import { Bitbucket } from "bitbucket";

export const createPR = async ({
  workspace,
  repo_slug,
  username,
  password,
  originBranch,
  destinationBranch,
}) => {
  try {
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
      url: data.links.html.href,
    };
  } catch (err) {
    console.log("bitbucket error", err.error);
  }
};
