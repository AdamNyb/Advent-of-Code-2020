const PATHS = [
  { right: 1, down: 1},
  { right: 3, down: 1},
  { right: 5, down: 1},
  { right: 7, down: 1},
  { right: 1, down: 2},
]

module.exports = {
  default: (input) => {
    const pathTrees = PATHS.map(({right, down}) => {
      const map = renderMaxNeededMap(input)
      const mapToUse = Object.assign([], map)
      const travelCoords = followThePath(mapToUse, right, down)

      const renderMapWithHits = reRenderMap(mapToUse, travelCoords)

      const numberOfTrees = travelCoords.filter(
        coord => coord.type === 'X'
      ).length

      return numberOfTrees
    })

    console.log(pathTrees)

    return pathTrees.reduce((acc,curr) => {
      acc = acc * curr
      return acc
    }, 1)
  }
}

renderMaxNeededMap = (input) => {
  const map = input
    .map(row => {
      return row.split('')
    })
  return map
}

reRenderMap = (mapAsArrays, travelCoords) => {
  const mapArraysWithHits = mapAsArrays.map((y, i) => {

    const yIndex = travelCoords[i].x
    y[yIndex] = travelCoords[i].type
    return y
  })

  return mapArraysWithHits.map(array => array.join('')).join('\n')
}

isTree = (location) => {
  if (location === '.') {
    return 'O'
  } else if (location === '#') {
    return 'X'
  } else {
    return '?'
  }
}

followThePath = (map, RIGHT, DOWN) => {
  const height = map.length
  let x = 0
  let travelCoords = []
  map.forEach((y, i) => {
    if (i % DOWN) {
      travelCoords.push({})
      return
    }

    const fromTheEdge = y.length - 1 - x
    let redo = x
    if (fromTheEdge < RIGHT) {
      redo = y.length - 1 - x
    }

    travelCoords.push({
      x,
      y: i,
      type: isTree(y[x])
    })

    x = fromTheEdge < RIGHT
      ? (RIGHT - 1) - redo
      : redo + RIGHT
  })

  return travelCoords
}