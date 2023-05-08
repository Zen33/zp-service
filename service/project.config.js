const { config } = require('./config/config')

module.exports = {
  outputDir: 'dist',
  srcDir: process.env.SRC_DIR || 'src/pages',
  dev: {
    publicPath: '/',
    port: process.env.PORT || 80
  },
  build: {
    publicPath: config.publicPath || './'
  },
  assetsSubDirectory: config.assetsSubDirectory || ''
}
