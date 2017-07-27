var isObject = require('lodash').isObject
var isArray = require('lodash').isArray
var path = require('path')

function parseSerires(serires) {
  if (isArray(serires)) {
    return parseArraySerires(serires)
  }
  if (isObject(parseObjectSerires)) {
    return parseObjectSerires(serires) 
  }
}

function parseObjectSerires(serires) {
  return Object.keys(serires).map(function(key) {
    var value = serires[key]
    if (isObject(value) || isArray(value)) {
      return wrapKeyAndValue(key, JSON.stringify(value))  
    }
    return wrapKeyAndValue(key, escape(value))
  }).join('\t')
}

function parseArraySerires(serires) {
  return serires.map(parseObjectSerires).join('\n')  
}

function escape(s) {
  return s.replace('\r', '\\r').replace('\t', '\\t').replace('\n', '\\n').replace('\\', '\\\\')
}

function wrapKeyAndValue(key, value) {
  return key + '=' + value
}

function getResourceUrl(repoName) {
  return path.join('/v2/repos/', repoName, '/data').toString()  
}

module.exports = {
  parseSerires:  parseSerires,
  getResourceUrl: getResourceUrl
}

