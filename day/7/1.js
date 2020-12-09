const flattenDeep = require('lodash/flattenDeep')

module.exports = {
  default: (input) => {

    const rules = input.reduce((acc, sentence) => {
      const rule = {}
      const [ colorWords, containWords ] = sentence.split('contain')

      const color = createColor(colorWords)
      const contains = containWords.split(',')
        .map(contain => {
          const amount = contain.match(/\d+/)
            ? contain.match(/\d+/)[0]
            : false
          
          if (!amount) return {}

          let containArray = contain.split(' ')
          // Don't include amount
          const colorWords = containArray.splice(2, containArray.length).join(' ')
          const color = createColor(colorWords)

          return { amount, color }
        })

        acc[color] = contains
        return acc
    }, {})


    const checkedColors = []
    const preFlattedAnswer = Object.keys(rules)
      // don't include gold in the search
      .filter(color => color !== 'shiny_gold')
      .map(color => canHoldShinyGold(color, rules))

    const colorSet = flattenDeep(preFlattedAnswer)
      .filter(a => a)
      .reduce((acc, colorPath) => {
        const primaryColor = colorPath.split('-->')[0]
        acc.add(primaryColor)
        return acc
      }, new Set())

    console.log(colorSet)
    return colorSet.size
  }
}

function createColor(colorWords) {
  return colorWords.split(' ').reduce((acc, curr) => {
    if (curr.startsWith('bag') || !curr) {
      return acc
    }
    return acc
      ? acc + '_' + curr
      : curr
  },'').trim('_')
}

function canHoldShinyGold (color, rules, log) {
  if (color === 'shiny_gold') {
    console.log('Found in colors: ' + log)
    return log
  } else if (!color) {
    return false
  }
  log = log
    ? log + '-->' + color
    : color

  return rules[color].map(bag => canHoldShinyGold(bag.color, rules, log))
}