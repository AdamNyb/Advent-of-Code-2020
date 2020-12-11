Array.prototype.sum = function () {
  return this.reduce((acc,curr) => acc += curr, 0)
}

const flatten = require('lodash/flatten')

module.exports = {
  default: (input) => {
    const series = new Series(input)

    return series.runSeries()
  }
}

class Series {
  constructor (input) {
    const numbers = input.map(number => parseInt(number))

    this.series = numbers

    this.preamble = []
    this.amble = []
    this.preambleSize = 25

    this.createAmbles()
    this.getHighestValidValue()
    this.validValues = new Set()
  }

  runSeries () {
    const rawSeries = [...this.series]

    let firstAttack = 0
    for (let serieIndex = this.preambleSize; serieIndex < rawSeries.length; serieIndex++) {
      this.setValidValues()

      const isValid = this.validValues.has(rawSeries[serieIndex])

      if (!isValid) {
        firstAttack = rawSeries[serieIndex]
        break
      }

      this.createAmbles()
    }
    return this.findWeakness(firstAttack)
  }

  createAmbles () {
    const seriesClone = [...(this.amble.length ? this.amble : this.series)]
    const preToTheAmble = [...seriesClone]
    if (this.preamble.length) {
      this.preamble.shift()
      this.preamble.push(this.amble[0])
      this.amble.shift()
    } else {
      this.preamble = preToTheAmble.slice(0, this.preambleSize)
      this.amble = seriesClone.slice(this.preambleSize)
    }
  }

  getHighestValidValue() {
    const preambleClone = [...this.preamble]

    const highest = Math.max(...preambleClone)
    // remove it
    preambleClone.splice(preambleClone.indexOf(highest), 1)
    const secondHighest = Math.max(...preambleClone)
    return [ highest, secondHighest ].sum()
  }

  getPreambleSums () {
    const preambleClone = [...this.preamble]
    this.validValues = new Set()
    return flatten(
      preambleClone.map(number1 => {
        const preambleClone2 = [...preambleClone]
        preambleClone2.splice(preambleClone2.indexOf(number1), 1)
        return preambleClone.forEach(number2 => this.validValues.add(number1 + number2)) 
      })
    )
  }

  setValidValues () {
    this.getPreambleSums()
  }

  // Contigous sum problem
  // Since we're using positive numbers a
  // sliding window would be O(n)
  findWeakness (target) {
    console.log(target, this.series)

    let windowStart = 0
    let windowEnd = 0
    let window = []
    for (let i = 0; i < this.series.length; i++) {
      window = this.series.slice(windowStart, windowEnd - windowStart + 1)

      let localSum = window.sum()
      console.log(window, localSum)

      if (localSum > target) {
        console.log('slide the window')
        windowStart++
        window.shift()
      }

      if (localSum === target) {
        break
      }

      windowEnd = i
      window.push(this.series[i])
    }

    return Math.min(...window) + Math.max(...window)
  }
}