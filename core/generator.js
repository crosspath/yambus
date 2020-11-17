const build_request_options = require('./arg_parser').build_request_options;

function generate_route_functions(routes, request_function) {
  const request_functions = Object.fromEntries(
    Object.entries(routes).map(pair => {
      const route = pair[1]
      const func  = (...args) => request_function(route, args)
      return [pair[0], func]
    })
  )

  const path_functions = Object.fromEntries(
    Object.entries(routes).map(pair => {
      const route = pair[1]
      const func  = (...args) => build_request_options(route, args).path
      return [`${pair[0]}_path`, func]
    })
  )

  return Object.assign({}, request_functions, path_functions)
}

module.exports = {generate_route_functions: generate_route_functions}
