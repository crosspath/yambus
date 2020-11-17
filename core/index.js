const blob_support = require('./blob_support')

module.exports = {
  build_request_options:    require('./arg_parser').build_request_options,
  generate_route_functions: require('./generator').generate_route_functions,
  has_blob:                 blob_support.has_blob,
  build_form_data:          blob_support.build_form_data
}
