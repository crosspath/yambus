const serialize = require('object-to-formdata').serialize

// object-to-formdata
const FD_OPTIONS = {
  allowEmptyArrays: true
}

function has_blob(obj, level = 0) {
  if (level >= 1000)
    throw new Error('Too deep')
  if (obj == null || typeof obj !== 'object')
    return false

  if (obj instanceof Blob) {
    return true
  } else if (Array.isArray(obj)) {
    for (const el of obj)
      if (has_blob(el, level + 1))
        return true
    return false
  } else {
    for (const key in obj)
      if (has_blob(obj[key], level + 1))
        return true
    return false
  }
}

function build_form_data(data) {
  return serialize(data, FD_OPTIONS)
}

module.exports = {
  has_blob:        has_blob,
  build_form_data: build_form_data
}
