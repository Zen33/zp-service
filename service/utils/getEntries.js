const { readdirSync } = require('fs')
const paths = require('./paths')
const config = require('../project.config')
const { config: serviceConfig } = require('../config/config')

module.exports = function getEntries (pagesDirPath) {
  const entries = {}
  const defaultPath = paths.resolve(config.srcDir)
  const baseResult = Array.isArray(pagesDirPath) ? pagesDirPath : readdirSync(defaultPath)
  const result = baseResult.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
  const entry = serviceConfig.entry || 'index.js'

  result.forEach(item => {
    entries[item] = paths.resolve(`${config.srcDir}/${item}/${entry}`)
  })

  return entries
}
