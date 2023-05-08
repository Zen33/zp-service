const yargs = require('yargs')
const { existsSync, readdirSync } = require('fs')
const { DefinePlugin, ProvidePlugin, ProgressPlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const paths = require('../utils/paths')
const config = require('../project.config')
const getEntries = require('../utils/getEntries')
const generatorHtml = require('../utils/generator')
const loadEnv = require('../utils/loadEnv')
const junk = require('../utils/junk')
const { stopSpinner } = require('../utils/spinner')
const isDev = process.env.NODE_ENV === 'development'

isDev && loadEnv(process.env.NODE_ENV)
const entries = isDev ? process.env.ENTRIES : yargs.argv.entries
const outputFileName = paths.getAssetPath(`js/[name]${!isDev ? '.[contenthash:8]' : ''}.js`)
const pagesDirPath = entries ? entries.split(',') : ''
const chalk = require('chalk')
const slog = require('single-line-log').stdout
const assetsInject = require('./assetsInject')
const { config: serviceConfig } = require('./config')
const assetFolder = paths.resolve('static')
const copyConfig = {
  patterns: [{
    from: paths.resolve('public'),
    toType: 'dir',
    globOptions: {
      ignore: ['.DS_Store', '**/index.html']
    },
    noErrorOnMissing: true
  }]
}

if (existsSync(assetFolder)) {
  const baseFiles = readdirSync(assetFolder)

  if (baseFiles.length) {
    copyConfig.patterns.push({
      from: assetFolder,
      to: config.assetsSubDirectory,
      globOptions: {
        ignore: ['.*']
      }
    })
  }
}

if (yargs.argv.junk) {
  junk(yargs.argv.junk)
}

const plugins = [
  new VueLoaderPlugin(),
  new CaseSensitivePathsPlugin(),
  ...generatorHtml(pagesDirPath),
  new assetsInject(),
  new CopyPlugin(copyConfig),
  new DefinePlugin({
    // vue3 feature flags <http://link.vuejs.org/feature-flags>
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false'
  }),
  new ProvidePlugin(serviceConfig.providePlugin || {}),
  new ProgressPlugin((percentage, message, ...args) => {
    const percent = (percentage * 100).toFixed(0)

    stopSpinner()
    slog(`${chalk.cyan(percent)}% ${chalk.yellow(message || 'All modules have been built completely.\n', ...args)}`)
  })
]

if (isDev) {
  plugins.unshift(new ESLintPlugin({
    emitError: true,
    emitWarning: true,
    extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
    formatter: require('eslint-formatter-friendly')
  }))
}

module.exports = {
  context: process.cwd(),
  entry: getEntries(pagesDirPath),
  output: {
    path: paths.resolve(config.outputDir),
    publicPath: isDev ? config.dev.publicPath : config.build.publicPath,
    filename: outputFileName,
    chunkFilename: outputFileName
  },
  externals: serviceConfig.externals || {},
  resolve: {
    alias: {
      '@': paths.resolve('src'),
      env: paths.resolve(`env/${process.env.NODE_ENV || 'development'}`),
      ...(serviceConfig.alias || {})
    },
    extensions: ['.js', '.jsx', '.vue', '.json', '.ts', '.tsx']
  },
  plugins,
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: serviceConfig.rules || [{
      test: /\.vue$/,
      use: ['vue-loader']
    }, {
      test: /\.m?jsx?$/,
      exclude: file => {
        // always transpile js in vue files
        if (/\.vue\.jsx?$/.test(file)) {
          return false
        }
        if (/node_modules((\/|\\)zp-service(\/|\\))/.test(file)) {
          return false
        }
        if (/static/.test(file)) {
          return false
        }
        // Don't transpile node_modules
        return /node_modules/.test(file)
      },
      use: isDev && serviceConfig.useEsbuild ? [serviceConfig.useEsbuild, 'babel-loader'] : ['babel-loader'] // use esbuild only dev mode without jsx, because jsxFactory is incompatible for now
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/],
            happyPackMode: true
          }
        }
      ]
    }, {
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      type: 'asset',
      generator: { filename: 'static/images/[contenthash:8][ext][query]' }
    }, { // https://github.com/facebookincubator/create-react-app/pull/1180
      test: /\.(svg)(\?.*)?$/,
      type: 'asset/resource',
      generator: { filename: 'static/svgs/[contenthash:8][ext][query]' }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset',
      generator: { filename: 'static/media/[contenthash:8][ext][query]' }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      type: 'asset',
      generator: { filename: 'static/fonts/[contenthash:8][ext][query]' }
    }]
  },
  cache: isDev ? {
    type: 'filesystem',
    hashAlgorithm: 'md4',
    maxAge: 7 * 24 * 60 * 60 * 1000
  } : false
}
