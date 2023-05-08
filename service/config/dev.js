const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./base')
const cssWebpackConfig = require('./css')
const config = require('../project.config')
const { config: serviceConfig } = require('./config')

module.exports = merge(baseWebpackConfig, cssWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    historyApiFallback: serviceConfig.historyApiFallback || false,
    compress: false,
    devMiddleware: {
      publicPath: config.dev.publicPath
    },
    open: false,
    host: process.env.HOST || '0.0.0.0',
    port: config.dev.port,
    liveReload: false,
    proxy: serviceConfig.proxy || {}
  },
  infrastructureLogging: {
    level: 'warn'
  }
})
