
module.exports = {
  default: (input) => {

    const peopleGroupsArray = []
    input.reduce((acc, curr, i) => {
      if (!curr) {
        peopleGroupsArray.push(acc)
        acc = []
        return acc
      }
      acc.push(curr)

      if (i === input.length - 1) {
        peopleGroupsArray.push(acc)
      }

      return acc
    }, [])

    const groups = peopleGroupsArray.map(groupAnswers => {
      const group = groupAnswers
        .join('')
      return group
    })

    const uniqueAnswersInGroups = groups.map(group => [...new Set(group)])

    const groupPoints = uniqueAnswersInGroups.map(answers => answers.length)

    Array.prototype.sum = function () {
      return this.reduce((acc,curr) => acc += curr, 0)
    }

    return groupPoints.sum()
  }
}

