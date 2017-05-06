# Decorator Debug

[![Greenkeeper badge](https://badges.greenkeeper.io/blakeembrey/decorator-debug.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Simple ES7 decorator for debugging classes and methods.

## Installation

```sh
npm install decorator-debug --save
```

## Usage

Every time the class or method is called, a console log will be emitted with the property `name`, `result`, `args`, `context` and `time` taken.

```js
import debug = require('decorator-debug')

@debug
class Demo {
  @debug
  method (string) {
    return true
  }
}

new Demo(1, 2, 3).method('test')

//=> new Demo { name: 'Demo', result: {}, context: {}, args: [ 1, 2, 3 ], time: 0.2647359999999992 }
//=> Demo#method { name: 'method', result: true, context: {}, args: [ 'test' ], time: 0.029204000000000008 }
```

**P.S.** You can debug conditionally.

```js
@debug(process.env.NODE_ENV !== 'production')
class Demo {}
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/decorator-debug.svg?style=flat
[npm-url]: https://npmjs.org/package/decorator-debug
[downloads-image]: https://img.shields.io/npm/dm/decorator-debug.svg?style=flat
[downloads-url]: https://npmjs.org/package/decorator-debug
[travis-image]: https://img.shields.io/travis/blakeembrey/decorator-debug.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/decorator-debug
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/decorator-debug.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/decorator-debug?branch=master
