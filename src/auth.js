const utils = require('utility')
const { getResourceUrl } = require('./utils')
const memoize = require('lodash').memoize
const btoa = require('btoa')

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
  }))
}

class Auth {
  constructor(ak, sk, expiresTime) {
    this.ak = ak
    this.sk = sk
    const now = parseInt(new Date().valueOf() / 1000)
    this.expires = now + (expiresTime || 60 * 60 * 5)  
  }

  getToken(repoName) {
    if (!this.ak) {
      throw 'ak is required'
    }

    if (!this.sk) {
      throw 'sk is required'
    }

    if (!repoName) {
      throw 'repoName is required'
    }

    const msg = {
      resource: getResourceUrl(repoName),
      expires: this.expires,
      contentMD5: '',
      contentType: 'text/plain',
      headers: '',
      method: 'POST',
    }
    const msgJSON = JSON.stringify(msg)
    const msgEncoded = b64EncodeUnicode(msgJSON)
    const msgEncrypted = utils.hmac('sha1', this.sk, msgEncoded).replace(/\+/g, '-').replace(/\//g, '_')
    return 'Pandora ' + this.ak + ':' + msgEncrypted + ':' + msgEncoded
  }
}

module.exports = Auth