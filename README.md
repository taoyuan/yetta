Yetta
=====
[![NPM Version](https://img.shields.io/npm/v/yetta.svg?style=flat)](https://www.npmjs.org/package/yetta)
[![Build Status](http://img.shields.io/travis/taoyuan/yetta.svg?style=flat)](https://travis-ci.org/taoyuan/yetta)
[![Dependencies](https://img.shields.io/david/taoyuan/yetta.svg?style=flat)](https://david-dm.org/taoyuan/yetta)

> Yetta is an extensible initialization module for [Node.js](http://nodejs.org/)
> applications based on [Bootable](https://github.com/jaredhanson/bootable).

> Yetta allows initialization *phases* to be registered for an application.
> These phases will be executed sequentially during startup, after which 
> the application will be ready to run.

## Installation

```bash
$ npm install yetta
```

## Usage

Yetta is generally applicable to any Node.js application or application
framework.  [Express](http://expressjs.com/) will be used below, for
illustrative purposes, as it is the most popular way of developing web
applications.

#### Mixin Yetta

Create a new application and mixin the yetta module.

```javascript
var express = require('express');
var yetta = require('yetta');

var app = yetta(express());
```

Once mixed-in, the application will have two additional functions: `app.boot`
and `app.phase`.

#### Register Phases

An application proceeds through a sequence of phases, in order to prepare
itself to handle requests.  Modules need to be configured, databases need to be
connected, and routes need to be drawn.

Yetta packages phases for these common scenarios:

```js
app.phase(yetta.initializers('config/initializers'));
```

Custom phases can be registered as well, and come in synchronous and
asynchronous flavors:

```
app.phase(function() {
  // synchronous phase
});

app.phase(function(done) {
  setTimeout(function() {
    // asynchronous phase
    done();
  }, 1000);
});
```

#### Boot Application

Call `app.boot` with a callback to boot your application.  Phases will be
executed sequentially, and the callback will be invoked when all phases are
complete.

```
app.boot(function(err) {
  if (err) { throw err; }
  app.listen(3000);
});
```

This allows you to split off your initialization steps into separate, organized
and reusable chunks of logic.

## Tests

```bash
 $ npm install
 $ npm test
```

## Credits

The usage document was taken from [Bootable](https://github.com/jaredhanson/bootable).

- Author: [Tao Yuan](https://github.com/taoyuan)
- Original Authors: [Jared Hanson](http://github.com/jaredhanson)

## License

Copyright (c) 2014 Tao Yuan  
Licensed under the MIT license.
