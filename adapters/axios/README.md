# Yambus

This package contains adapter for generating requests with [Axios][1],
used by [Yambus][2].

Yambus generates functions for obtaining paths and making requests to your
application.

See more at [Yambus project page][2].

[1]: https://github.com/axios/axios
[2]: https://github.com/crosspath/yambus

## Installation

    $ yarn add @crosspath/yambus @crosspath/yambus-axios
    
## Usage

Assume you have generated object with routes in file `routes`.

```js
import Routes from 'routes'

// Send request with positional arguments:
Routes.route_name('test-value').then(resp => console.log(resp.data))
// Or with object:
Routes.route_name({url: 'test-value'}).then(resp => console.log(resp.data))
```

These functions return `Promise`. Variable `resp` here contains
Axios' wrapper for response. You may get response data as `resp.data`.
See [Axios documentation](https://github.com/axios/axios#response-schema) for
more information about its response object.

## Contributing

Bug reports and pull requests are welcome on GitHub at
[github.com/crosspath/yambus](https://github.com/crosspath/yambus).

Please do not change version number in pull requests.

## License

This package is available as open source under the terms of
the [MIT License](https://opensource.org/licenses/MIT).
