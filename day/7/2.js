Array.prototype.sum = function () {
  return this.reduce((acc,curr) => acc + parseInt(curr), 0)
}

module.exports = {
  default: (input) => {

    const rules = input.reduce((acc, sentence) => {
      const rule = {}
      const [ colorWords, containWords ] = sentence.split('contain')

      const color = createColor(colorWords)
      const contains = containWords.split(',')
        .map(contain => {
          const amount = contain.match(/\d+/)
            ? parseInt(contain.match(/\d+/)[0])
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

    return getBagsInBag('shiny_gold', 1, rules) - 1
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

function getBagsInBag (color, amount, rules) {
  if (!color) {
    return 0
  }

  console.log(rules[color])
  let totalInThisBag = amount

  totalInThisBag += rules[color]
    .map((bag) => {
      const amountInBag = getBagsInBag(bag.color, bag.amount, rules)

      return amountInBag
    })
    .sum() * amount

  return totalInThisBag
}