import assert from 'assert'
import formatmicro from "./index.js"

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
        it("Should work with microseconds and seconds", () => {
            const totalTimeOne = oneMs + oneµs
            const totalTimeMult = 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "9 ms 6 µs")
        })

        it("Should work with microseconds and seconds and minutes", () => {
            const totalTimeOne = oneM + oneMs + oneµs
            const totalTimeMult = 16*oneM + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 m 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "16 m 9 ms 6 µs")
        })

        it("Should work with microseconds and seconds and minutes and hours", () => {
            const totalTimeOne = oneH + oneM + oneMs + oneµs
            const totalTimeMult = 12*oneH + 16*oneM + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 h 1 m 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "12 h 16 m 9 ms 6 µs")
        })

        it("Should work with microseconds and seconds and minutes and hours and days", () => {
            const totalTimeOne = oneD + oneH + oneM + oneMs + oneµs
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeOne), "1 d 1 h 1 m 1 ms 1 µs")
            assert.equal(formatmicro(totalTimeMult), "4 d 12 h 16 m 9 ms 6 µs")
        })
    })

    describe("For custom increment names array", () => {
        it("Should use the singular custom names", () => {
            const totalTimeOne = oneD + oneH + oneM + oneMs + oneµs

            assert.equal(formatmicro(totalTimeOne, customIncrementNames), "1 day 1 hour 1 minute 1 millisecond 1 microsecond")
        })

        it("Should use the plural custom names", () => {
            const totalTimeMult = 4*oneD + 12*oneH + 16*oneM + 9*oneMs + 6*oneµs

            assert.equal(formatmicro(totalTimeMult, customIncrementNames), "4 days 12 hours 16 minutes 9 milliseconds 6 microseconds")
        })

        it("Should use the plural and singular custom names", () => {
            const totalTimeMixed = oneD + 12*oneH + oneM + 9*oneMs + oneµs

            assert.equal(formatmicro(totalTimeMixed, customIncrementNames), "1 day 12 hours 1 minute 9 milliseconds 1 microsecond")
        })
    })
})