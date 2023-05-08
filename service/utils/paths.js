const { posix } = require('path')

// gen static file path
exports.getAssetPath = (...args) => posix.join('static', ...args)

// gen absolute path
exports.resolve = (...args) => posix.join(process.cwd(), ...args)
