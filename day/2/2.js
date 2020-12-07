module.exports = {
  default: (input) => {
    
    const inputCollection = getCollection(input)

    return inputCollection
      .reduce((acc,curr) => {
        if (isPasswordValid(curr)) {
          acc.push(curr)
        }
        return acc

      }, [])
      .length
  }
}

getCollection = (input) => {
  return input.map(row => {
    let [ policyLengths, policyLetter, password ] = row.split(' ')

    policyLetter = policyLetter.replace(/[^a-z]/, '')

    return {
      policyLetter,
      policyLengths,
      password
    }
  })
}

isPasswordValid = ({
  policyLetter,
  policyLengths,
  password
}) => {
  // Elves dont have zero index, so minus 1
  const firstPosition = policyLengths.split('-')[0] - 1
  const secondPosition = policyLengths.split('-')[1] - 1

  const passWordArray = password.split('')

  const bothAreTheLetter = (passWordArray[firstPosition] === passWordArray[secondPosition])
  const firstIsTheLetter = passWordArray[firstPosition] === policyLetter
  const secondIsTheLetter = passWordArray[secondPosition] === policyLetter

  return !bothAreTheLetter && (firstIsTheLetter || secondIsTheLetter)
}