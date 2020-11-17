const yambus = require('@crosspath/yambus')
const axios  = require('axios')

function add_data(params) {
  const data = params.data

  if (data instanceof FormData)
    return data
  else if (data != null && typeof data === 'object' && yambus.has_blob(data))
    return yambus.build_form_data(data)

  return data
}

function request(route, params, set_options) {
  let options = {
    url:    params.path,
    method: route.verb,
    params: params.url_options,
    data:   add_data(params)
  }

  if (typeof set_options === 'function')
    options = set_options(params.path, options, route, params)

  return axios.request(options)
}

module.exports = {request: request}
