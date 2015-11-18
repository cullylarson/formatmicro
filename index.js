'use strict';
export default (timeMicro, incrementNames) => {
    incrementNames = {
            'd' : ['d', 'd'],
            'h' : ['h', 'h'],
            'm' : ['m', 'm'],
            's' : ['s', 's'],
            'ms' : ['ms', 'ms'],
            'µs' : ['µs', 'µs'],
            ...incrementNames,
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
        if(!incrementNames.hasOwnProperty(key)) return carry
        else if(parts[key] === 0) return carry
        else return carry +
            ((carry === "") ? "" : " ") +
            parts[key].toString() + " " +
            ((parts[key] === 1) ? incrementNames[key][0] : incrementNames[key][1])
    }, "")
}
