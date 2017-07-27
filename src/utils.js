var isObject = require('lodash').isObject
var isArray = require('lodash').isArray
var path = require('path')

function parseSeries(series) {
  if (isArray(series)) {
    return parseArraySeries(series)
  }
  if (isObject(parseObjectSeries)) {
    return parseObjectSeries(series) 
  }
}

function parseObjectSeries(series) {
  return Object.keys(series)
  .filter(function(key){
    var value = series[key]
    return value !== null && value !== undefined 
  })
  .map(function(key) {
    var value = series[key]
    if (isObject(value) || isArray(value)) {
      return wrapKeyAndValue(key, JSON.stringify(value))  
    }
    return wrapKeyAndValue(key, escape(value))
  })
  .join('\t')
}

function parseArraySeries(series) {
  return series.map(parseObjectSeries).join('\n')  
}

function escape(value) {
  var s = value + ''
  return s.replace('\r', '\\r').replace('\t', '\\t').replace('\n', '\\n').replace('\\', '\\\\')
}

function wrapKeyAndValue(key, value) {
  return key + '=' + value
}

function getResourcePath(repoName) {
  return '/v2/repos/' + repoName + '/data'
}

module.exports = {
  parseSeries:  parseSeries,
  getResourcePath: getResourcePath
}

