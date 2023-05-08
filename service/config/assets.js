const { config } = require('./config')
const assets = process.env.NODE_ENV === 'production' ? 
  (config.assets && config.assets.production || []) : 
  (config.assets && config.assets.development || [])

module.exports = assets
