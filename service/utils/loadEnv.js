const { resolve } = require('path')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const { error } = require('./logger')

module.exports = function loadEnv (mode) {
  const basePath = resolve(process.cwd(), `.env${mode ? `.${mode}` : ``}`)

  try {
    const env = dotenv.config({ path: basePath, debug: process.env.DEBUG })

    dotenvExpand(env)
  } catch (err) {
    // only ignore error if file is not found
    if (err.toString().indexOf('ENOENT') < 0) {
      error(err)
    }
  }
}
