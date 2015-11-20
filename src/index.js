'use strict'

const defaultIncrementNames = {
    'd': ['d', 'd'],
    'h': ['h', 'h'],
    'm': ['m', 'm'],
    's': ['s', 's'],
    'ms': ['ms', 'ms'],
    'µs': ['µs', 'µs'],
}
/**
 * @module formatmicro
 */

/**
 * Formats microseconds into strings that look like:  1 d 3 h 7 m 28 s 500 ms 324 µs
 *
 * @param {number} timeMicro
 * @param {object|function|undefined} incrementNames
 * @returns {string}
 * @throws {Error} If either argument isn't the correct type
 */
const formatmicro = (timeMicro, incrementNames) => {
    if(Number(parseFloat(timeMicro)) !== timeMicro) throw new Error("First parameter must be a number.")
    if(incrementNames && (typeof incrementNames !== "function") && (typeof incrementNames !== "object")) throw new Error("Second parameter, if provided, must be a function or an object")

    let formatReduce

    if(incrementNames && typeof incrementNames === "function") {
        formatReduce = incrementNames
    }
    else {
        incrementNames = {
            ...defaultIncrementNames,
            ...incrementNames,
        }

        formatReduce = (carry, incrementKey, value) => {
            if(value === 0) return carry
            else return carry +
                ((carry === "") ? "" : " ") +
                value.toString() + " " +
                ((value === 1) ? incrementNames[incrementKey][0] : incrementNames[incrementKey][1])
        }
    }


    const increments = {'d' : 8.64e10, 'h' : 3.6e9, 'm' : 6e7, 's' : 1e6, 'ms' : 1000, 'µs' : 1 }

    // how much of each increment step makes up our time
    const parts = Object.keys(increments).reduce((carry, key) => {
        const incValue = Math.floor(carry.microLeft / increments[key])
        const microValue = incValue * increments[key]

        return {
            ...carry,
            [key]: incValue,
            microLeft: carry.microLeft - microValue,
        }
    }, {microLeft: timeMicro})

    // format the final result
    return Object.keys(parts).reduce((carry, key) => {
        if(!increments.hasOwnProperty(key)) return carry
        else return formatReduce(carry, key, parts[key])
    }, "")
}

/**
 * Formats microseconds into strings that look like:  1 day 3 hours 7 minutes 28 seconds 500 milliseconds 324 microseconds
 *
 * @param {number} timeMicro
 * @param {object|function|undefined} incrementNames
 * @returns {string}
 * @throws {Error} If either argument isn't the correct type
 */
const bignames = (timeMicro, incrementNames) => {
    if(!incrementNames || (typeof incrementNames === "object")) {
        incrementNames = {
            'd' : ['day', 'days'],
            'h' : ['hour', 'hours'],
            'm' : ['minute', 'minutes'],
            's' : ['second', 'seconds'],
            'ms' : ['millisecond', 'milliseconds'],
            'µs' : ['microsecond', 'microseconds'],
            ...incrementNames,
        }
    }

    return formatmicro(timeMicro, incrementNames)
}

/**
 * Same as {@link formatmicro}, except it only returns the first two non-zero values.
 *
 * @param {number} timeMicro
 * @param {object|function|undefined} incrementNames
 * @returns {string}
 * @throws {Error} If either argument isn't the correct type
 */
const onlytwo = (timeMicro, incrementNames) => {
    if(!incrementNames || (typeof incrementNames === "object")) {
        incrementNames = {
            ...defaultIncrementNames,
            ...incrementNames,
        }
    }
    else if(typeof incrementNames === "function") {
        return formatmicro(timeMicro, incrementNames)
    }

    let foundNum = 0
    const takeFor = 2
    const formatReduce = (carry, incrementKey, value) => {
        if(foundNum >= takeFor) return carry
        if(value === 0) return carry

        foundNum++

        return carry +
            ((carry === "") ? "" : " ") +
            value.toString() + " " +
            ((value === 1) ? incrementNames[incrementKey][0] : incrementNames[incrementKey][1])
    }

    return formatmicro(timeMicro, formatReduce)
}

export {
    formatmicro as default,
    formatmicro,
    bignames,
    onlytwo,
}
