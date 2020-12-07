module.exports = {
  default: (input) => {
    
    const map = renderMaxNeededMap(input)

    const travelCoords = followThePath(map)

    const renderMapWithHits = reRenderMap(map, travelCoords)
    console.log(renderMapWithHits)
    const numberOfTrees = travelCoords.filter(
      coord => coord.type === 'X'
    ).length

    return numberOfTrees
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

/**
  Fun twist: readline.js doesn't like long strings in the output (console.log)
    so I couldn't concat the rows to desire width. Had to instead let the sled
    "jump back" to the start of the next array.
 */
followThePath = (map) => {
  const height = map.length
  let x = 0
  let travelCoords = []
  map.forEach((y, i) => {
    const fromTheEdge = y.length - 1 - x
    let redo = x
    if (fromTheEdge < 3) {
      redo = y.length - 1 - x
    }

    travelCoords.push({
      x,
      y: i,
      type: isTree(y[x])
    })

    x = fromTheEdge < 3
      ? 2 - redo
      : redo + 3
  })

  return travelCoords
}