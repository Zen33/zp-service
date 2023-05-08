const {
  existsSync,
  writeFile,
  writeFileSync,
  readFile,
  readdirSync
} = require('fs')
const { argv } = require('yargs')
const { entries, junk } = argv
const env = process.env.NODE_ENV
const rm = require('rimraf')
const webpack = require('webpack')
const chalk = require('chalk')
const rmItem = require('../utils/rmItem')
const { error, done } = require('../utils/logger')
const { logWithSpinner, stopSpinner } = require('../utils/spinner')
const paths = require('../utils/paths')
const webpackConfig = require('../config/prod')
const config = require('../project.config')
const getContent = (manifest, files) => {
  const content = {}

  manifest.forEach(meta => {
    files.forEach(file => {
      content[file] = content[file] || []
      if (meta.includes(`/${file}.`) || meta.includes(`/${file}/`) || meta.includes('chunk-')) {
        content[file].push(meta)
      }
    })
  })

  return content
}
const init = () => {
  const compiler = webpack(webpackConfig, (err, stats) => {
    stopSpinner(false)
    if (err) throw err

    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    )

    if (stats.hasErrors()) {
      error('Build failed with errors.\n')
      process.exit(1)
    }
  })

  compiler.hooks.afterEmit.tap('build', ({ assets }) => { // manifest record
    const manifest = assets ? Object.keys(assets) : []
    const file = paths.resolve(`${config.outputDir}/manifest.json`)

    if (!existsSync(file)) {
      logWithSpinner('Creating manifest...')
      writeFileSync(file, JSON.stringify({}))
    }

    readFile(file, 'utf8', (err, data) => {
      if (err) throw err
      let content

      try {
        content = JSON.parse(data)
      } catch (err) {
        content = {}
      }
      
      if (entries) { // with entries
        if (`${content}` === '{}') { // manifest is empty
          content = getContent(manifest, entries.split(','))
        } else {
          const newly = getContent(manifest, entries.split(','))

          content = Object.assign(content, newly)
          const dir = `${config.outputDir}/static/js/` // hard code for now !important
          const baseFiles = readdirSync(dir)
          const files = baseFiles.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))

          for (let file of files) {
            const fileName = paths.resolve(dir, file)

            if (fileName.includes('chunk-')) {
              const baseName = fileName.split('/').slice(-3).join('/')
              let exist = false

              for (let key in content) {
                if (content[key].includes(baseName)) {
                  exist = true
                }
              }
              if (!exist) { // remove old chunk-* file
                logWithSpinner(`Removing useless chunk file: dist/${chalk.yellow(baseName)}...`)
                rm.sync(fileName)
              }
            }
          }
        }
      } else {
        const baseFiles = readdirSync(paths.resolve(config.outputDir))
        const files = baseFiles.filter(file => file.slice(-5) === '.html').map(file => file.split('.').shift())

        content = getContent(manifest, files)
      }

      writeFile(file, JSON.stringify(content), 'utf8', err => {
        logWithSpinner('Updating manifest...')
        if (err) throw err

        logWithSpinner('')
        stopSpinner(false)
        console.log()
        done(`Build ${chalk.cyan(env)} complete.\n`)
      })
    })
  })
}
const service = () => {
  if (entries) {
    const items = entries.split(',')

    items.forEach(item => {
      rmItem(paths.resolve(config.outputDir), item)
      logWithSpinner(`Removing old entry: ${chalk.yellow(item)}...`)
    })
    init()
  } else {
    rm(paths.resolve(config.outputDir), err => {
      if (err) throw err

      init()
    })
  }
  !junk && logWithSpinner(`Building for ${chalk.cyan(env)}...`)
}

module.exports = service
