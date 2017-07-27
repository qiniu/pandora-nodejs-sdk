var fetch = require('node-fetch');
var parseSeries = require('./utils').parseSeries
var getResourcePath = require('./utils').getResourcePath

function send (auth, repoName, series) {
  var token =  auth.getToken(repoName)
  return fetch('https://pipeline.qiniu.com' + getResourcePath(repoName), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': token
    },
    body: parseSeries(series)
  })
  .then(function(res) {
    return res.json()
  })
  .then(function(res) {
    if (res.error) {
      throw res
    }
  })
}

module.exports = {
  send: send,
  Auth: require('./auth')
}
