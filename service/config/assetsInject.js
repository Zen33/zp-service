const HtmlWebpackPlugin = require('html-webpack-plugin')
const assets = require('./assets')

function assetsInject (options = {}) {
  this.options = options
}

assetsInject.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('assetsInject', compilation => {
    HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('assetsInject', (data, cb) => {
      const [first, ...rest] = assets

      data.assets.js = [first, ...this.options.paths || [], ...data.assets.js, ...rest]
      cb(null, data)
    })
  })
}

module.exports = assetsInject
