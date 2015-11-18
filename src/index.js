'use strict'
/**
 * @module formatmicro
 */

/**
 * @param {number} timeMicro
 * @param {object|function} incrementNames
 * @returns {string}
 * @throws {Error} If either argument isn't the correct type
 */
export default function formatmicro(timeMicro, incrementNames) {
    if(Number(parseFloat(timeMicro)) !== timeMicro) throw new Error("First parameter must be a number.")
    if(incrementNames && (typeof incrementNames !== "function") && (typeof incrementNames !== "object")) throw new Error("Second parameter, if provided, must be a function or an object")

    let formatReduce

    if(incrementNames && typeof incrementNames === "function") {
        formatReduce = incrementNames
    }
    else {
        incrementNames = {
            'd' : ['d', 'd'],
            'h' : ['h', 'h'],
            'm' : ['m', 'm'],
            's' : ['s', 's'],
            'ms' : ['ms', 'ms'],
            'µs' : ['µs', 'µs'],
            ...incrementNames,
        }

        formatReduce = (carry, incrementName, value) => {
            if(value === 0) return carry
            else return carry +
                ((carry === "") ? "" : " ") +
                value.toString() + " " +
                ((value === 1) ? incrementNames[incrementName][0] : incrementNames[incrementName][1])
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
