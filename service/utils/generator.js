const { readdirSync, accessSync } = require('fs')
const paths = require('./paths')
const config = require('../project.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { config: serviceConfig } = require('../config/config')

module.exports = function generatorHtml (pagesDirPath) {
  const items = []
  const defaultPath = paths.resolve(config.srcDir)
  const baseResult = Array.isArray(pagesDirPath) ? pagesDirPath : readdirSync(defaultPath)
  const result = baseResult.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))

  result.forEach(item => {
    let template
    const templatePath = `${defaultPath}/${item}/index.html`

    try {
      accessSync(templatePath)
      template = templatePath
    } catch(err) {
      template = paths.resolve('public/index.html')
    }
    const options = {
      inject: serviceConfig.assets && serviceConfig.assets.inject || 'body',
      template,
      filename: `${item}.html`,
      chunks: ['manifest', 'vendor', item]
    }

    if (process.env.NODE_ENV === 'development') {
      options.development = true
    }
    items.push(new HtmlWebpackPlugin(options))
  })

  return items
}
