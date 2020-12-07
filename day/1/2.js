// input is a textfile
module.exports = {
  default: (input) => {
    let bigTotal = 0
    let val1
    let val2
    let val3
    input = input.map(v => +v)
    for (const i in input) {
      val1 = input[i]
      const smallerInput = input.filter(val => val !== val1)
      for (const j in smallerInput) {
        val2 = smallerInput[j]
        const smallestInput = smallerInput.filter(val => val !== val2)
        for (const k in smallestInput) {
          val3 = smallestInput[k]
          if (val1 + val2 + val3 === 2020) {       
            return val1 * val2 * val3
          }
        }
      }
    }
  }
}
