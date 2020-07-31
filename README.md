# Yambus

JS code for generating functions for accessing application routes (e.g.
`create_account_path`) and performing XHR requests (e.g. `create_account`).

See [gem Railbus](https://github.com/crosspath/railbus) for more information.

## Installation

    $ yarn add @crosspath/yambus

## Usage

For using Yambus you need object for defining application routes:

```js
{
  // Route names will be used for names of generated functions as
  // `${route_name}` for XHR requests and `${route_name}_path` for getting path.
  route_name: {
    // HTTP verbs: 'get', 'post', 'put', 'patch', 'delete'
    verb: 'get',

    // ':url' is a placeholder for a value
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

// Axios is not required but used for demonstration purpose.
// You may use any other library or `fetch` for HTTP requests.
import axios from 'axios'

const routes = { /* your application routes */ }

const route_functions = yambus.generate_route_functions(
  routes,
  (route, args) => {
    const params = yambus.build_request_options(route, args)
    return axios.request({
      url:    params.path,
      method: route.verb,
      params: params.url_options,
      data:   params.data
    })
  }
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

// Send request with positional arguments:
Routes.route_name('test-value').then(response => console.log(response.data))
// Or with object:
Routes.route_name({url: 'test-value'}).then(response => console.log(response.data))
```

### Functions' arguments

Here `String or Number, ...` represents values used in paths, e.g.
`:id`, `:category_id` (zero, one or more params).

And `...path_params` means hash-like object with values for paths, e.g.
`{id: 123, category_id: 56}` (zero, one or more params).

`data` means request body (payload), it can be hash-like object, `FormData` and
so on, its allowed types depend on XHR library or request function.

All arguments are optional.

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

## Contributing

Bug reports and pull requests are welcome on GitHub at
[github.com/crosspath/yambus](https://github.com/crosspath/yambus).

Please do not change version number in pull requests.

## License

This package is available as open source under the terms of
the [MIT License](https://opensource.org/licenses/MIT).
