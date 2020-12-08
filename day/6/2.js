
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
      const defaultGroupAnswers = {
        size: 0,
        a: 0,
        b: 0,
        c: 0,
        x: 0,
        y: 0,
        z: 0
      }

      const group = groupAnswers.reduce((acc, personAnswers) => {
        personAnswers.split('').forEach(answer => {
          acc[answer]
            ? acc[answer]++
            : acc[answer] = 1
          })
        acc.size++
        return acc
      }, defaultGroupAnswers)
      return group
    })
    console.log(groups)

    const groupPoints = groups.map(group => {
      const commonAnswers = getCommonAnswers(group)
      return commonAnswers.length
    })
    console.log(groupPoints)

    Array.prototype.sum = function () {
      return this.reduce((acc,curr) => acc += curr, 0)
    }

    return groupPoints.sum()
  }
}

const getCommonAnswers = (group) => {
  return Object.entries(group)
    .filter(([key, value]) => value === group.size)
    .filter(([key, value]) => key !== 'size')
    .map(([key, value]) => key)
    .join('')
}