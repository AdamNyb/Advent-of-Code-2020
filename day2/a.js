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
  const minLength = policyLengths.split('-')[0]
  const maxLength = policyLengths.split('-')[1]

  const everyOccurenceOfLetter = password.split('')
    .reduce((acc, curr) => {
      if (curr !== policyLetter) {
        return acc
      }
      acc.push(curr)
      return acc
   }, [])

  return everyOccurenceOfLetter.length >= minLength
    && everyOccurenceOfLetter.length <= maxLength
}