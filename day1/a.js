// input is a textfile
module.exports = {
  default: (input) => {
    let bigTotal = 0
    for (const i in input) {
      const val = input[i]
      const [ firstVal, secondVal ] = findCorresponding(val, input, 2020)
      if (!firstVal) {
        continue
      }

      bigTotal = firstVal * secondVal
      break
    }
    return bigTotal
  }
}

function findCorresponding (val, arr, sumToFind) {
  const valToFind = sumToFind - val
  
  const found = arr.includes(valToFind.toString())
  if (!found) return []

  return [ val, valToFind ]
}