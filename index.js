'use strict';
export default (timeMicro, incrementNames) => {
    let formatReduce;

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
