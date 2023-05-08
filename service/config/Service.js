const {
  existsSync,
  statSync,
  mkdirSync,
  readdirSync,
  copyFileSync
} = require('fs')
const rm = require('rimraf')
const { resolve, join } = require('path')
const { error, done } = require('../utils/logger')
const serviceConfig = require('./config')
const INIT = Symbol('init')
const DEV = Symbol('dev')
const BUILD = Symbol('build')
const CONFIG = Symbol('config')
const CONFIG_NAME = 'service.config.js'
const copySync = (src, dest) => {
  const exists = existsSync(src)
  const stats = exists && statSync(src)
  const isDirectory = exists && stats.isDirectory()

  if (isDirectory) {
    mkdirSync(dest)
    readdirSync(src).forEach(item => {
      copySync(join(src, item), join(dest, item))
    })
  } else {
    copyFileSync(src, dest)
  }
}

class Service {
  constructor () {
    const argv = require('minimist')(process.argv.slice(2))

    this.env = argv._[0] || 'development'
  }

  [INIT] () {
    // copy public/index.html to project & init service.config.js file
    const srcDir = resolve(__dirname, '../../public')
    const destDir = resolve(process.cwd(), 'public')
    const srcFile = resolve(__dirname, `../${CONFIG_NAME}`)
    const destFile = resolve(process.cwd(), CONFIG_NAME)

    try {
      rm.sync(destDir)
      rm.sync(destFile)
      copySync(srcDir, destDir)
      copyFileSync(srcFile, destFile)
      done('Initialization successfully completed')
    } catch (err) {
      error(`${err}`)
    }
  }
  [DEV] () {
    const launch = require('../commands/serve')

    launch()
  }
  [BUILD] () {
    const launch = require('../commands/build')
  
    launch()
  }
  [CONFIG] () {
    const config = resolve(process.cwd(), CONFIG_NAME)

    if (existsSync(config)) {
      return require(config)
    }
    return {}
  }
  start () {
    if (this.env === 'init') {
      this[INIT]()
      return
    }
    process.env.NODE_ENV = this.env
    serviceConfig.config = this[CONFIG]()
    this[this.env === 'development' ? DEV : BUILD]()
  }
}

module.exports = Service
