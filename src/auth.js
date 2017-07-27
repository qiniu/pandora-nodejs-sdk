var utils = require('utility')
var getResourcePath = require('./utils').getResourcePath

function Auth(ak, sk, maxAge) {
  this.ak = ak
  this.sk = sk
  var now = Math.floor(new Date().valueOf() / 1000)
  this.expires = now + (maxAge || 60 * 60 * 5)  
}

Auth.prototype.getToken = function(repoName) {
  if (!this.ak) {
    throw new Error('ak is required')
  }

  if (!this.sk) {
    throw new Error('sk is required')
  }

  if (!repoName) {
    throw new Error('repoName is required')
  }

  var msg = {
    resource: getResourcePath(repoName),
    expires: this.expires,
    contentMD5: '',
    contentType: 'text/plain',
    headers: '',
    method: 'POST',
  }
  var msgJSON = JSON.stringify(msg)
  var msgEncoded = utils.base64encode(msgJSON)
  var msgEncrypted = utils.hmac('sha1', this.sk, msgEncoded).replace(/\+/g, '-').replace(/\//g, '_')
  return 'Pandora ' + this.ak + ':' + msgEncrypted + ':' + msgEncoded
}

module.exports = Auth