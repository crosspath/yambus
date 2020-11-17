const arg_parser   = require('./arg_parser')
const blob_support = require('./blob_support')
const generator    = require('./generator')

module.exports = Object.assign({}, arg_parser, blob_support, generator)
