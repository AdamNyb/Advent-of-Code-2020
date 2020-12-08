const ROWS_ON_PLANE = 128
const COLUMNS_ON_PLANE = 8
const ROW_GROUPS = 7
const COLUMN_GROUPS = 3

module.exports = {
  default: (input) => {

    const seatIds = input.map(boardingPass => {
      const { row, column } = findSeat(boardingPass)

      const seatId = row * 8 + column
      console.log('seatId is', seatId)
      return seatId
    })

    return Math.max(...seatIds)
  }
}


const findSeat = (boardingPass) => {
  const rowDirections = boardingPass.match(/[FB]+/)[0]
  const columnDirections = boardingPass.match(/[RL]+/)[0]

  const [ firstRowDirection, ...remainingRowDirections ] = rowDirections
  console.log(firstRowDirection, rowDirections, remainingRowDirections)
  const row = keepLooking({
    direction: firstRowDirection,
    remainingDirections: remainingRowDirections,
    lower: 0,
    upper: ROWS_ON_PLANE - 1
  })

  const [ firstColumnDirection, ...remainingColumnDirections ] = columnDirections
  const column = keepLooking({
    direction: firstColumnDirection,
    remainingDirections: remainingColumnDirections,
    lower: 0,
    upper: COLUMNS_ON_PLANE - 1
  })
  return { row, column }
}

const keepLooking = ({direction, remainingDirections, lower, upper}) => {
  if (!direction) {
    return lower
  }


  // console.log(`${upperCentre}-${upperTop}`)
  const [ nextDirection, ...nextRemaingDirections ] = remainingDirections
  const nextParams = {
    direction: nextDirection,
    remainingDirections: nextRemaingDirections
  }
  if (/[FL]/.test(direction)) {
    const diff = upper - lower
    const half = Math.floor((diff)/2)
    const center = lower + half
    console.log(`${direction} ${lower}-${center}`)
    nextParams.lower = lower
    nextParams.upper = center
  } else if (/[BR]/.test(direction)) {
    const diff = upper - lower
    const half = Math.ceil(diff/2)
    const center = lower + half 
    console.log(`${direction} ${center}-${upper}`)
    nextParams.lower = center
    nextParams.upper = upper
  }
    // console.log(nextParams)

  return keepLooking(nextParams)
}

const createRanges = (rows, columns) => {



}