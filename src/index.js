var fetch = require('node-fetch');
var parseSerires = require('./utils').parseSerires
var getResourceUrl = require('./utils').getResourceUrl

function send (auth, repoName, serires) {
  var token =  auth.getToken(repoName)
  return fetch('https://pipeline.qiniu.com' + getResourceUrl(repoName), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': token
    },
    body: parseSerires(serires)
  })
  .then(function(res){
    return res.json()
  })
}

module.exports = {
  send: send,
  Auth: require('./auth')
}
