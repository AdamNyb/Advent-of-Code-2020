Array.prototype.sum = function () {
  return this.reduce((acc,curr) => acc += curr, 0)
}

const flatten = require('lodash/flatten')

module.exports = {
  default: (input) => {
    const series = new Series(input)

    console.log(series.preamble)
    console.log('')
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
      console.log(rawSeries)

    let firstAttack = 0
    for (let serieIndex = this.preambleSize; serieIndex < rawSeries.length; serieIndex++) {
      console.log(rawSeries[serieIndex])
      this.setValidValues()

      const isValid = this.validValues.has(rawSeries[serieIndex])

      if (!isValid) {
        console.log('First non-valid is: ' + rawSeries[serieIndex])
        firstAttack = rawSeries[serieIndex]
        break
      }

      this.createAmbles()
    }

    return firstAttack
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
    console.log('Preamble is now: ' + this.preamble)
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
}