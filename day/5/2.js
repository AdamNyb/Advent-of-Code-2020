const ROWS_ON_PLANE = 128
const COLUMNS_ON_PLANE = 8
const ROW_GROUPS = 7
const COLUMN_GROUPS = 3

const difference = require('lodash/difference')

module.exports = {
  default: (input) => {

    const seatIds = []
    input.forEach(boardingPass => {
      const { row, column } = findSeat(boardingPass)
      
      if (row === 0 || row === 127) {
        return
      }

      const seatId = row * 8 + column
      seatIds.push(seatId)
    })

    const mySeat = findMySeat(seatIds)

    return mySeat
  }
}


const findSeat = (boardingPass) => {
  const rowDirections = boardingPass.match(/[FB]+/)[0]
  const columnDirections = boardingPass.match(/[RL]+/)[0]

  const [ firstRowDirection, ...remainingRowDirections ] = rowDirections
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
    nextParams.lower = lower
    nextParams.upper = center
  } else if (/[BR]/.test(direction)) {
    const diff = upper - lower
    const half = Math.ceil(diff/2)
    const center = lower + half 
    nextParams.lower = center
    nextParams.upper = upper
  }

  return keepLooking(nextParams)
}

const findMySeat = (seatIds) => {  
  const uniqueSeats = [...new Set(seatIds)]
  const minSeatId = Math.min(...uniqueSeats)
  const maxSeatId = Math.max(...uniqueSeats)

  const allSeats = new Array(maxSeatId - minSeatId)
    // Can't map empty arrays. They need some values first
    .fill(undefined)
    .map((empty, i) => i + minSeatId)
  const emptySeats = difference(allSeats, uniqueSeats)

  if (emptySeats.length === 1) {
    return emptySeats[0]
  }
}