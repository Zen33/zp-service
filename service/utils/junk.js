const { readFile, writeFileSync } = require('fs')
const rm = require('rimraf')
const paths = require('./paths')
const { done } = require('./logger')
const config = require('../project.config')
const { logWithSpinner, stopSpinner } = require('./spinner')

module.exports = function junk (value) {
  const pages = value.split(',')
  const file = paths.resolve(`${config.outputDir}/manifest.json`)

  readFile(file, 'utf8', (err, data) => {
    if (err) throw err
    let content

    try {
      content = JSON.parse(data)
    } catch (err) {
      content = {}
    }
    const items = Object.keys(content)

    for (let key of items) {
      if (pages.includes(key)) {
        logWithSpinner('Remove page and assets...')
        rm.sync(paths.resolve(`${config.outputDir}/${key}.html`)) // page
        for (let asset of content[key]) {
          if (asset.includes(key)) { // asset
            rm.sync(paths.resolve(`${config.outputDir}/${asset}`))
          }
        }
      }
    }
    for (let page of pages) {
      delete content[page]
    }
    logWithSpinner('Updating manifest...')
    writeFileSync(file, JSON.stringify(content), 'utf8')

    logWithSpinner('')
    stopSpinner(false)
    console.log()
    done(`Remove pages complete.\n`)
    process.exit(0)
  })
}
