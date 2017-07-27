const fetch = require('node-fetch');
const { parseSerires, getResourceUrl } = require('./utils')

function send (auth, repoName, serires) {
  const token =  auth.getToken(repoName)
  return fetch(`https://pipeline.qiniu.com${getResourceUrl(repoName)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': token
    },
    body: parseSerires(serires)
  })
}

module.exports = {
  send: send,
  Auth: require('./auth')
}
