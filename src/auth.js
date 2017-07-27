var utils = require('utility')
var getResourceUrl = require('./utils').getResourceUrl
var btoa = require('btoa')

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
  }))
}

function Auth(ak, sk, expiresTime) {
  this.ak = ak
  this.sk = sk
  var now = parseInt(new Date().valueOf() / 1000)
  this.expires = now + (expiresTime || 60 * 60 * 5)  
}

Auth.prototype.getToken = function(repoName) {
  if (!this.ak) {
    throw 'ak is required'
  }

  if (!this.sk) {
    throw 'sk is required'
  }

  if (!repoName) {
    throw 'repoName is required'
  }

  var msg = {
    resource: getResourceUrl(repoName),
    expires: this.expires,
    contentMD5: '',
    contentType: 'text/plain',
    headers: '',
    method: 'POST',
  }
  var msgJSON = JSON.stringify(msg)
  var msgEncoded = b64EncodeUnicode(msgJSON)
  var msgEncrypted = utils.hmac('sha1', this.sk, msgEncoded).replace(/\+/g, '-').replace(/\//g, '_')
  return 'Pandora ' + this.ak + ':' + msgEncrypted + ':' + msgEncoded
}

module.exports = Auth