import assert from 'assert'
import {default as formatmicro, bignames, onlytwo} from "./../dist/index.js"

const oneµs = 1
const oneMs = 1000
const oneS  = 1000*1000
const oneM  = 60*1000*1000
const oneH  = 60*60*1000*1000
const oneD  = 24*60*60*1000*1000

const customIncrementNames = {
    'd' : ['day', 'days'],
    'h' : ['hour', 'hours'],
    'm' : ['minute', 'minutes'],
    's' : ['second', 'seconds'],
    'ms' : ['millisecond', 'milliseconds'],
    'µs' : ['microsecond', 'microseconds'],
}

const defaultIncrementNames = {
    'd': ['d', 'd'],
    'h': ['h', 'h'],
    'm': ['m', 'm'],
    's': ['s', 's'],
    'ms': ['ms', 'ms'],
    'µs': ['µs', 'µs'],
}

describe('Format Micro', () => {
    describe("For only one increment", () => {
        it("Should work with microseconds", () => {
            const tenµs = 10*oneµs

            assert.equal(formatmicro(oneµs), "1 µs")
            assert.equal(formatmicro(tenµs), "10 µs")
        })

        it("Should work with milliseconds", () => {
            const tenMs = 10*oneMs

            assert.equal(formatmicro(oneMs), "1 ms")
            assert.equal(formatmicro(tenMs), "10 ms")
        })

        it("Should work with seconds", () => {
            const tenS = 10*oneS

            assert.equal(formatmicro(oneS), "1 s")
            assert.equal(formatmicro(tenS), "10 s")
        })

        it("Should work with minutes", () => {
            const tenM = 10*oneM

            assert.equal(formatmicro(oneM), "1 m")
            assert.equal(formatmicro(tenM), "10 m")
        })

        it("Should work with hours", () => {
            const tenH = 10*oneH

            assert.equal(formatmicro(oneH), "1 h")
            assert.equal(formatmicro(tenH), "10 h")
        })

        it("Should work with days", () => {
            const tenD = 10*oneD

            assert.equal(formatmicro(oneD), "1 d")
            assert.equal(formatmicro(tenD), "10 d")
        })
    })

    describe("For multiple increments", () => {
        it("Should work with microseconds and milliseconds", () => {
            const totalTimeOne = oneMs + oneµs
            const totalTimeMult = 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "9 ms 6 µs")
        })

        it("Should work with microseconds and milliseconds and seconds", () => {
            const totalTimeOne = oneMs + oneS + oneµs
            const totalTimeMult = 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 s 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "59 s 9 ms 6 µs")
        })

        it("Should work with microseconds and milliseconds and seconds and minutes", () => {
            const totalTimeOne = oneM + oneMs + oneS + oneµs
            const totalTimeMult = 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 m 1 s 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "16 m 59 s 9 ms 6 µs")
        })

        it("Should work with microseconds and milliseconds and seconds and minutes and hours", () => {
            const totalTimeOne = oneH + oneM + oneS + oneMs + oneµs
            const totalTimeMult = 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 h 1 m 1 s 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "12 h 16 m 59 s 9 ms 6 µs")
        })

        it("Should work with microseconds and milliseconds and seconds and minutes and hours and days", () => {
            const totalTimeOne = oneD + oneH + oneM + oneS + oneMs + oneµs
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 d 1 h 1 m 1 s 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "4 d 12 h 16 m 59 s 9 ms 6 µs")
        })
    })

    describe("For increments with zeros", () => {
        it("Should not output them", () => {
            const totalTimeOne = oneD + oneH + 0*oneM + oneS + oneMs + oneµs
            const totalTimeMulti1 = 0*oneD + 12*oneH + 16*oneM +  0*oneS + 9*oneMs + 6*oneµs
            const totalTimeMulti2 = 4*oneD +  0*oneH + 16*oneM + 59*oneS + 0*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 d 1 h 1 s 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMulti1), "12 h 16 m 9 ms 6 µs")
            assert.equal(formatmicro(totalTimeMulti2), "4 d 16 m 59 s 6 µs")
        })
    })

    describe("For custom increment names array", () => {
        it("Should use the singular custom names", () => {
            const totalTimeOne = oneD + oneH + oneM + oneS + oneMs + oneµs

            assert.equal(formatmicro(totalTimeOne, customIncrementNames), "1 day 1 hour 1 minute 1 second 1 millisecond 1 microsecond")
        })

        it("Should use the plural custom names", () => {
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeMult, customIncrementNames), "4 days 12 hours 16 minutes 59 seconds 9 milliseconds 6 microseconds")
        })

        it("Should use the plural and singular custom names", () => {
            const totalTimeMixed = oneD + 12*oneH + oneM + 59*oneS + 9*oneMs + oneµs

            assert.equal(formatmicro(totalTimeMixed, customIncrementNames), "1 day 12 hours 1 minute 59 seconds 9 milliseconds 1 microsecond")
        })
    })

    describe("For custom increment names array, with only some names provided", () => {
        it("Should use the provided ones, and the defaults for the ones not provided", () => {
            const someIncrementNames = {
                'd': ['day', 'days'],
                'h': ['hour', 'hours'],
                'ms' : ['millisecond', 'milliseconds'],
            }

            const totalTimeMult = 4*oneD + oneH + 16*oneM + 59*oneS + 300*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeMult, someIncrementNames), "4 days 1 hour 16 m 59 s 300 milliseconds 6 µs")
        })
    })

    describe("For custom increment reduce function", () => {
        it("Should use the function", () => {
            const totalTimeOne = oneD + oneH + oneM + oneS + oneMs + oneµs

            const customIncrementReduce = (carry, incrementKey, value) => {
                if(incrementKey === 'd') return "find me!"
                else return carry
            }

            assert.equal(formatmicro(totalTimeOne, customIncrementReduce), "find me!")
        })

        it("Should use the function for all values", () => {
            const totalTimeOne = oneD + oneH + oneM + oneS + oneMs + oneµs
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            const customIncrementReduce = (carry, incrementKey, value) => {
                return carry + ((carry !== "") ? " " : "") + value.toString()
            }

            assert.equal(formatmicro(totalTimeOne, customIncrementReduce), "1 1 1 1 1 1")
            assert.equal(formatmicro(totalTimeMult, customIncrementReduce), "4 12 16 59 9 6")
        })

        it("Shouldn't output the values I choose not to", () => {
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            // only output the first three found values
            let foundNum = 0
            const customIncrementReduce = (carry, incrementKey, value) => {
                if(foundNum >= 3) return carry
                if(value === 0) return carry

                foundNum++

                return carry + ((carry !== "") ? " " : "") + value.toString()
            }

            assert.equal(formatmicro(totalTimeMult, customIncrementReduce), "4 12 16")
        })
    })

    describe("For zero microseconds", () => {
        it("Should return nothing", () => {
            assert.equal(formatmicro(0), "")
        })
    })

    describe("For non-numeric values", () => {
        it("Should throw an exception", () => {
            assert.throws(() => formatmicro({}), Error)
        })
    })

    describe("For non-object, non-function second parameters", () => {
        it("Should throw an exception", () => {
            assert.throws(() => formatmicro(100, "bad"), Error)
        })
    })

    describe("For array as second parameters", () => {
        it("Should perform normally", () => {
            assert.equal(formatmicro(1000, []), "1 ms")
        })
    })
})

describe("Big Names", () => {
    describe("For mixed increments", () => {
        it("Should use the singular custom names", () => {
            const totalTimeOne = oneD + oneH + oneM + oneS + oneMs + oneµs

            assert.equal(bignames(totalTimeOne), "1 day 1 hour 1 minute 1 second 1 millisecond 1 microsecond")
        })

        it("Should use the plural custom names", () => {
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(bignames(totalTimeMult), "4 days 12 hours 16 minutes 59 seconds 9 milliseconds 6 microseconds")
        })

        it("Should use the plural and singular custom names", () => {
            const totalTimeMixed = oneD + 12*oneH + oneM + 59*oneS + 9*oneMs + oneµs

            assert.equal(bignames(totalTimeMixed), "1 day 12 hours 1 minute 59 seconds 9 milliseconds 1 microsecond")
        })
    })

    describe("For alternate increment names array", () => {
        it("Should use the alternate names", () => {
            const totalTimeMixed = oneD + 12*oneH + oneM + 59*oneS + 9*oneMs + oneµs

            assert.equal(bignames(totalTimeMixed, defaultIncrementNames), "1 d 12 h 1 m 59 s 9 ms 1 µs")
        })
    })
})

describe("Only Two", () => {
    describe("For all non-zero values", () => {
        it("Should format only the first two", () => {
            const totalTimeMult = 4*oneD + oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(onlytwo(totalTimeMult), "4 d 1 h")
        })
    })

    describe("For some zero values", () => {
        it("Should format only the first two non-zero", () => {
            const totalTimeMult = 4*oneD + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(onlytwo(totalTimeMult), "4 d 59 s")
        })
    })

    describe("For custom increment names array", () => {
        it("Should use the singular custom names", () => {
            const totalTimeOne = oneD + oneH + oneM + oneS + oneMs + oneµs

            assert.equal(onlytwo(totalTimeOne, customIncrementNames), "1 day 1 hour")
        })

        it("Should use the plural custom names", () => {
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(onlytwo(totalTimeMult, customIncrementNames), "4 days 12 hours")
        })

        it("Should use the plural and singular custom names", () => {
            const totalTimeMixed = 12*oneH + oneS + 9*oneMs + oneµs

            assert.equal(onlytwo(totalTimeMixed, customIncrementNames), "12 hours 1 second")
        })
    })

    describe("For custom reduce function", () => {
        it("Should use the custom reduce function", () => {
            const formatReduce = (carry, incrementKey, value) => {
                if(value === 0) return carry
                else return carry +
                    ((carry === "") ? "" : " ") +
                    value.toString() + " " +
                    ((value === 1) ? customIncrementNames[incrementKey][0] : customIncrementNames[incrementKey][1])
            }

            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 59*oneS + 9*oneMs + 6*oneµs

            assert.equal(onlytwo(totalTimeMult, formatReduce), "4 days 12 hours 16 minutes 59 seconds 9 milliseconds 6 microseconds")
        })
    })
})
