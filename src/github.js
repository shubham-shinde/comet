const { Bitbucket } = require('bitbucket')
// const bitbucket = new Bitbucket()

const authorise = (token) => {
  const clientOptions = {
    auth: {
      token: token,
    },
  }
  return new Bitbucket(clientOptions)
};
