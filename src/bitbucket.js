const { Bitbucket } = require('bitbucket')
// const bitbucket = new Bitbucket()
// const token =

export const createBranchFromMaster = (username, password) => {
  const clientOptions = {
    auth: {
      username: username,
      password: password,
    },
  }
  const bitbucket = new Bitbucket(clientOptions)
};


