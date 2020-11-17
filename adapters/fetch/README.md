# Yambus

This package contains adapter for generating requests with [fetch function][1],
used by [Yambus][2].

Yambus generates functions for obtaining paths and making requests to your
application.

See more at [Yambus project page][2].

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[2]: https://github.com/crosspath/yambus

## Installation

    $ yarn add @crosspath/yambus @crosspath/yambus-fetch

## Usage

Assume you have generated object with routes in file `routes`.

```js
import Routes from 'routes'

// Send request with positional arguments:
Routes.route_name('test-value').then(body => console.log(body))
// Or with object:
Routes.route_name({url: 'test-value'}).then(body => console.log(body))
```

These functions return `Promise`. Variable `body` here contains response data.

## Contributing

Bug reports and pull requests are welcome on GitHub at
[github.com/crosspath/yambus](https://github.com/crosspath/yambus).

Please do not change version number in pull requests.

## License

This package is available as open source under the terms of
the [MIT License](https://opensource.org/licenses/MIT).
