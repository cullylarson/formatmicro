# formatmicro [![Build Status](https://travis-ci.org/cullylarson/formatmicro.svg?branch=master)](https://travis-ci.org/cullylarson/formatmicro)

> Formats microseconds into a human consumable form.


## Install

```
$ npm install formatmicro --save
```


## Usage

```js
import microseconds from 'microseconds'
import formatmicro from 'formatmicro'

const start = microseconds.now()

// do some stuf

const end = microseconds.now()
const period = end - start

console.log("Task completed in: " + formatmicro(period))
```

## Options

You can optionally pass the names of the increments (e.g hours, minutes, days, etc.) as the second
function parameter. The keys define the increment and the values are a two-item array, where the
first item is the singular name of the increment (e.g day) and the second item is the plural name
(e.g. days).  If you don't provide some of the names, the defaults will be used.

For example:

```js
import microseconds from 'microseconds'
import formatmicro from 'formatmicro'

const start = microseconds.now()

// do some stuf

const end = microseconds.now()
const period = end - start

const incrementNames = {
    'd' : ['day', 'days'],
    'h' : ['hour', 'hours'],
    'm' : ['minute', 'minutes'],
    's' : ['second', 'seconds'],
    'ms' : ['millisecond', 'milliseconds'],
    'µs' : ['microsecond', 'microseconds'],
}

console.log("Task completed in: " + formatmicro(period, incrementNames))
```


## License

MIT © Cully Larson
