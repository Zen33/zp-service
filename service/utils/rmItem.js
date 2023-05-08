const { readdirSync, existsSync, lstatSync } = require('fs')
const rm = require('rimraf')
const path = require('path')

module.exports = async function rmItem (startPath, name) {
  if (!existsSync(startPath)) {
    return
  }
  const baseFiles = readdirSync(startPath)
  const files = baseFiles.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)) // filter files like .DS_Store...

  for (let file of files) {
    const fileName = path.join(startPath, file)
    const stat = lstatSync(fileName)

    if (stat.isDirectory()) {
      if (file === name) {
        rm.sync(fileName)
      } else {
        rmItem(fileName, name)
      }
    } else {
      const pureName = file.split('.').shift()

      if (pureName === name) {
        rm.sync(fileName)
      }
    }
  }
}
