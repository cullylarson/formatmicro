# formatmicro [![Build Status](https://travis-ci.org/cullylarson/formatmicro.svg?branch=master)](https://travis-ci.org/cullylarson/formatmicro) [![Coverage Status](https://coveralls.io/repos/cullylarson/formatmicro/badge.svg?branch=master&service=github)](https://coveralls.io/github/cullylarson/formatmicro?branch=master) [![Docs Status](https://doc.esdoc.org/github.com/cullylarson/formatmicro/badge.svg)](https://doc.esdoc.org/github.com/cullylarson/formatmicro/)

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

```js
import formatmicro from 'formatmicro'

const oneµs = 1
const oneMs = 1000
const oneS  = 1000*1000
const oneM  = 60*1000*1000
const oneH  = 60*60*1000*1000
const oneD  = 24*60*60*1000*1000

const totalTime = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

console.log(formatmicro(totalTimeMult))
// 4 d 12 h 16 m 59 s 9 ms 6 µs

```

### bignames

You can also import `bignames`, to output increments using their full names (e.g "days", "hours", etc.).
For example:

```js
import {bignames} from 'formatmicro'

const oneµs = 1
const oneMs = 1000
const oneS  = 1000*1000
const oneM  = 60*1000*1000
const oneH  = 60*60*1000*1000
const oneD  = 24*60*60*1000*1000

const totalTime = oneD + 12*oneH + 16*oneM + 59*oneS + oneMs + 6*oneµs

console.log("Task completed in: " + bignames(totalTime))
// Task completed in: 1 day 12 hours 16 minutes 59 seconds 1 millisecond 6 microseconds
```

The function signature is the same as `formatmicro`, so you could provide a custom reduce or custom
increment names if you wanted.

### onlytwo

You can also import `onlytwo`, to output only the first two, non-zero increments.
For example:

```js
import {onlytwo} from 'formatmicro'

const oneµs = 1
const oneMs = 1000
const oneS  = 1000*1000
const oneM  = 60*1000*1000
const oneH  = 60*60*1000*1000
const oneD  = 24*60*60*1000*1000

const totalTime = oneD + 12*oneH + 16*oneM + 59*oneS + oneMs + 6*oneµs

console.log("Task completed in: " + onlytwo(totalTime))
// Task completed in: 1 d 12 h
```

The function signature is the same as `formatmicro`, so you could provide a custom reduce or custom
increment names if you wanted. For example:

```js
import {onlytwo} from 'formatmicro'

const oneµs = 1
const oneMs = 1000
const oneS  = 1000*1000
const oneM  = 60*1000*1000
const oneH  = 60*60*1000*1000
const oneD  = 24*60*60*1000*1000

const totalTime = 12*oneH + oneS + 9*oneMs + oneµs

const incrementNames = {
    'd' : ['day', 'days'],
    'h' : ['hour', 'hours'],
    'm' : ['minute', 'minutes'],
    's' : ['second', 'seconds'],
    'ms' : ['millisecond', 'milliseconds'],
    'µs' : ['microsecond', 'microseconds'],
}

console.log("Task completed in: " + onlytwo(totalTime, incrementNames))
// Task completed in: 12 hours 1 second
```

### onlytwoBignames

Just like `onlytwo`, but uses "bignames".

## Options

You can optionally pass the names of the increments (e.g hours, minutes, days, etc.) as the second
function parameter. The keys define the increment and the values are a two-item array, where the
first item is the singular name of the increment (e.g day) and the second item is the plural name
(e.g. days).  If you don't provide some of the names, the defaults will be used.

For example:

```js
import formatmicro from 'formatmicro'

const oneµs = 1
const oneMs = 1000
const oneS  = 1000*1000
const oneM  = 60*1000*1000
const oneH  = 60*60*1000*1000
const oneD  = 24*60*60*1000*1000

const totalTime = oneD + 12*oneH + 16*oneM + 59*oneS + oneMs + 6*oneµs

const incrementNames = {
    'd' : ['day', 'days'],
    'h' : ['hour', 'hours'],
    'm' : ['minute', 'minutes'],
    's' : ['second', 'seconds'],
    'ms' : ['millisecond', 'milliseconds'],
    'µs' : ['microsecond', 'microseconds'],
}

console.log("Task completed in: " + formatmicro(totalTime, incrementNames))
// Task completed in: 1 day 12 hours 16 minutes 59 seconds 1 millisecond 6 microseconds
```

### Custom Reducer

Instead of passing just the names, you can pass a reducer function to format the final result.
It accepts the following parameters:

* __carry__ _(string)_ This is the return from the last call to the reducer function (starts
as a empty string).
* __incrementKey__ _(string)_ This will be: d, h, m, s, ms, or µs
* __value__ _(int)_ The value for this increment (e.g. the number of seconds, or the number of minutes).

Here are some examples:

#### Default Behavior

```js
import microseconds from 'microseconds'
import formatmicro from 'formatmicro'

const start = microseconds.now()

// do some stuf

const end = microseconds.now()
const period = end - start

const incrementNames = {
    'd' : ['d', 'd'],
    'h' : ['h', 'h'],
    'm' : ['m', 'm'],
    's' : ['s', 's'],
    'ms' : ['ms', 'ms'],
    'µs' : ['µs', 'µs'],
}

const formatReduce = (carry, incrementKey, value) => {
    if(value === 0) return carry
    else return carry +
        ((carry === "") ? "" : " ") +
        value.toString() + " " +
        ((value === 1) ? incrementNames[incrementKey][0] : incrementNames[incrementKey][1])
}

console.log("Task completed in: " + formatmicro(period, formatReduce))
```

#### Only Output the First Three Values Found

```js
let foundNum = 0
const formatReduce = (carry, incrementKey, value) => {
    if(foundNum >= 3) return carry
    if(value === 0) return carry

    foundNum++

    return carry +
        ((carry !== "") ? " " : "") +
        value.toString() + " " +
        incrementKey
}

console.log("Task completed in: " + formatmicro(period, formatReduce))
```


## License

MIT © Cully Larson
