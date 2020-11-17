# Yambus

This package generates functions for accessing application routes (e.g.
`create_account_path`) and performing requests to the application (e.g.
`create_account`).

See [gem Railbus](https://github.com/crosspath/railbus) for integration with
Rails framework.

## Installation

    $ yarn add @crosspath/yambus

Recommended step: add adapter for generating requests. Do one of these commands:

    $ yarn add @crosspath/yambus-axios
    $ yarn add @crosspath/yambus-fetch

Package `yambus-axios` uses `axios` library that supports latest browser
versions and IE9+. Package `yambus-fetch` uses native function `fetch` that
isn't available in IE but you may use it with Edge, Chrome, Firefox, Safari,
Opera.

Also you may write adapter for any other library or function.
Package `yambus-axios` contains very short code that you may use as base
for writing your adapter.

## Usage

Assume you have an object for defining application routes:

```js
{
  // Route names will be used for names of generated functions as
  // `${route_name}` for requests and `${route_name}_path` for getting path.
  route_name: {
    // HTTP verbs: 'get', 'post', 'put', 'patch', 'delete', 'head'.
    // Lower case!
    verb: 'get',

    // ':url' is a placeholder for a value, and any ':value' too.
    path: '/string/representation/of/your/:url',

    // Array of strings and objects. Each object has form `{a: 'name'}`,
    // it contains name of placeholder for a value.
    parts: ['/string/representation/of/your/', {a: 'url'}],

    // Array of strings. Each string is name of placeholder for a value.
    required: ['url'],

    // The same `route_name`
    name: 'route_name'
  }, ...
}
```

This object should be generated, not written by hand.

Now you may use your routes for generating functions with Yambus:

```js
// Example file name: routes.js

import yambus from '@crosspath/yambus'

// Import adapter for doing requests via Axios.
// Axios is not required but used for demonstration purpose.
// You may use `yambus-fetch` package or any other library for HTTP requests.
import { request } from '@crosspath/yambus-axios'

const routes = { /* your application routes */ }

const route_functions = yambus.generate_route_functions(
  routes,
  (route, args) => request(route, yambus.build_request_options(route, args))
)

export default route_functions
```

Import this file and call its functions:

```js
import Routes from 'routes'

// Get path with positional arguments:
console.log(Routes.route_name_path('test-value'))
// Or with object:
console.log(Routes.route_name_path({url: 'test-value'}))
// Result:
// => /string/representation/of/your/test-value
```

How does it work? When you use positional arguments (first case above), values
are passed to elements of `parts` in this route, one-by-one in the same order.
And when you use `{object}` (second case), values passed to the named elements
of `parts` using placeholders like `{a: 'url'}`.

Also you may call requests to the application:

```js
// Send request with positional arguments:
Routes.route_name('test-value').then(resp => console.log(resp.data))
// Or with object:
Routes.route_name({url: 'test-value'}).then(resp => console.log(resp.data))
```

These functions return `Promise`. See adapters' README for more info about
value of `resp` variable.

### Functions' arguments

Here `String or Number, ...` represents values used in paths, e.g.
`:id`, `:category_id` (zero, one or more params); that's positional arguments
for generating paths (first case).

And `...path_params` means object with values for paths, e.g.
`{id: 123, category_id: 56}` (zero, one or more params); that's passing object
with values for generating paths (second case).

`data` here means request body (payload), it can be `{object}`, `FormData` and
so on, its allowed types depend on library or function for doing requests.

```js
// Request actions with `get` & `delete` verbs.
({format: String, ...path_params, ...url_options})
// Or:
(String or Number, ..., {format: String, ...url_options})

// Request actions with `post`, `put`, and `patch` verbs.
({format: String, ...path_params, ...url_options}, data)
// Or:
(String or Number, ..., {format: String, ...url_options}, data)

// Get path for any action (does not include query string starting with '?').
({format: String, ...path_params})
// Or:
(String or Number, ..., {format: String})
```

`format` is optional. If passed it will be appended to the path as
`/your/url.json` for `{format: 'json'}`.

All arguments are optional. But if you need to pass data and leave path params
empty, then you should pass explicit first argument `{}`. For example,

```js
const fd = new FormData()
fd.append('attachment', input.files[0]) // Assume `input` is `<input/>` node.
Routes.attach_file({}, fd) // Instead of `Routes.attach_file(fd)`.
```

### Available exported functions

`build_request_options(route, args) -> {path, url_options, data}`

Purpose: parse arguments and apply values to path's placeholders.

Arguments:

- `route`, object `{verb, path, parts, required, name}`, it's your app route
- `args`, array of `String | Number | Object`, contains passed arguments to
  path & request functions

Returns:

- `path`, string, URL
- `url_options`, Object, contains passed arguments to path & request functions
  (except request body)
- `data`, null or Object, request body

---

`generate_route_functions(routes, request_function) -> {...}`

Purpose: create functions for getting application paths and performing requests.

Arguments:

- `routes`, Object, collection of your app routes
- `request_function`, function `(route, args) => Promise`, function for doing
  requests. Params `route` & `args` are the same as in `build_request_options`.
  
Returns:

- key-value Object, where key is function's name and value is function

---

`has_blob(obj, level = 0) -> boolean`

Purpose: check whether this object contains `Blob` (attached `File`). If it has
`Blob` then this object should be send with `FormData`.

Arguments:

- `obj`, Object, data for request body
- `level`, Number, how deep in the data we are now. Recursion stops on
  `level >= 1000`.
  
Returns:

- true if `obj` is object and contains `Blob`
- false, otherwise

---

`build_form_data(obj) -> FormData`

Purpose: wrapper for creating `FormData` object. `obj` should not be `FormData`.

Arguments:

- `obj`, Object, data for request body
  
Returns:

- `FormData` object

## Contributing

Bug reports and pull requests are welcome on GitHub at
[github.com/crosspath/yambus](https://github.com/crosspath/yambus).

Please do not change version number in pull requests.

## License

This package is available as open source under the terms of
the [MIT License](https://opensource.org/licenses/MIT).
