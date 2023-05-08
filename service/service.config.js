module.exports = {
  assets: {
    inject: true,
    development: [],
    production: [] 
  },  // inject js files for all pages
  providePlugin: {}, // ProvidePlugin
  externals: {},
  alias: {},
  browserslist: [],
  publicPath: '',
  cssLoaderOptions: { // sass & stylus for now
    'sass-loader': {},
    'stylus-loader': {}
  },
  historyApiFallback: false,
  entry: 'index.js'
}