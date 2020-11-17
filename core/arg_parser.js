function split_args(route, args) {
  const required_params = route.required
  let path_params = {}, url_options = {}, data = {}

  for (let index in args) {
    const arg = args[index]
    if (['string', 'number'].includes(typeof arg)) {
      path_params[required_params[index]] = arg
    } else {
      break
    }
  }

  let options = args[Object.keys(path_params).length]
  data = args[Object.keys(path_params).length + 1]

  if (typeof options !== 'object')
    options = {}
  if (typeof data !== 'object')
    data = {}

  for (let param of required_params) {
    if (!(param in path_params)) {
      if (param in options) {
        path_params[param] = options[param]
      } else {
        throw new Error(required_param(route, param))
      }
    }
  }

  const format = presence(options.format)
  const extracted = required_params.concat(['format'])

  url_options = Object.fromEntries(
    Object.entries(options).filter(pair => !extracted.includes(pair[0]))
  )

  return {path_params, format, url_options, data}
}

function presence(v) {
  return (v != null && v !== '') ? v : null
}

function required_param(route, param) {
  return `Cannot find "${param}" in passed URL options. ` +
      `This value is required for route "${route.name}" (${route.path}).`;
}

function build_request_options(route, args) {
  const params = split_args(route, args)
  let path = route.parts.
      map(v => typeof v === 'string' ? v : params.path_params[v.a]).join('')
  if (params.format)
    path += `.${params.format}`
  if (['get', 'head', 'delete'].includes(route.verb))
    params.data = null
  return {path: path, url_options: params.url_options, data: params.data}
}

module.exports = {build_request_options: build_request_options}
