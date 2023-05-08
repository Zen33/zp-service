const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { info } = require('../utils/logger')
const getLocalIP = require('../utils/getLocalIP')

const devWebpackConfig = require('../config/dev')
const portfinder = require('portfinder')
const devServerOptions = devWebpackConfig.devServer
const protocol = devServerOptions.https ? 'https' : 'http'
const host = devServerOptions.host || '0.0.0.0'

info('Starting development server...')

const init = (port, err = '') => {
  // publish the new Port, necessary for e2e tests
  process.env.PORT = port
  // add port to devServer config
  devServerOptions.port = port

  const compiler = webpack(devWebpackConfig)
  const server = new WebpackDevServer(devServerOptions, compiler)

  compiler.hooks.done.tap('serve', stats => {
    if (stats.hasErrors()) {
      return
    }
    const entries = process.env.ENTRIES || ''
    const entry = entries ? chalk.cyan(`/${entries.split(',').shift()}.html`) : ''

    process.nextTick(() => {
      console.log(`${chalk.red(`${err}`)}`)
      console.log()
      console.log(`App running at:`)
      console.log(`  - Local:   ${chalk.cyan(`${protocol}://${host}:${port}`)}${entry}`)
      console.log(`  - Network: ${chalk.cyan(`${protocol}://${getLocalIP()}:${port}`)}${entry}`)
      console.log()
    })
  })

  server.start(port, host, err => {
    if (err) {
      process.exit(0)
    }
  })
}
const service = () => {
  portfinder.basePort = process.env.PORT || devServerOptions.port
  portfinder.getPortPromise().then(port => init(port)).catch(err => init(devServerOptions.port, err))
}

module.exports = service
