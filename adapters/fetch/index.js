const yambus = require('@crosspath/yambus')
const qs     = require('query-string')

// query-string
const QS_OPTIONS = {
  arrayFormat: 'bracket',
  sort:        false,
  skipNull:    true
}

function build_url(params) {
  const opt       = params.url_options
  const has_query = Object.keys(opt).length > 0
  const query     = has_query ? `?${qs.stringify(opt, QS_OPTIONS)}` : ''

  return `${params.path}${query}`
}

function as_json(route, params) {
  if (!['get', 'head', 'delete'].includes(route.verb))
    return {
      headers: {'Content-Type': 'application/json'},
      body:    JSON.stringify(params.data)
    }

  return {}
}

function add_data(route, params) {
  const data = params.data

  if (data instanceof FormData)
    return {body: data}
  else if (data != null && typeof data === 'object' && yambus.has_blob(data))
    return {body: yambus.build_form_data(data)}

  return as_json(route, params)
}

function request(route, params, set_options) {
  const url  = build_url(params)

  let options = {method: route.verb}
  Object.assign(options, add_data(route, params))

  if (typeof set_options === 'function')
    options = set_options(url, options, route, params)

  return fetch(url, options).then(response => response.json())
}

module.exports = {request: request}
