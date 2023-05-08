const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./base')
const cssWebpackConfig = require('./css')
const config = require('../project.config')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const browserslist2Esbuild = require('./browserlist2Esbuild')
const { config: serviceConfig } = require('./config')
const browserslist = serviceConfig.browserslist || ['Chrome >= 59'] // chrome 60 and later versions

module.exports = merge(baseWebpackConfig, cssWebpackConfig, {
  mode: 'production',
  output: {
    publicPath: config.build.publicPath
  },
  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: browserslist2Esbuild(browserslist),
        css: true,
        legalComments: 'none',
        minify: true,
        exclude: ['node_modules'],
        pure: ['console.log', 'debugger']
      }),
      '...' // For webpack@5 you can use the `...` syntax to extend existing minimizers, uncomment the next line
    ],
    runtimeChunk: {
      name: 'runtime'
    },
    // https://webpack.js.org/configuration/optimization/#optimizationmoduleids
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
})
