const readline = require('readline')
const fs = require('fs')

function run () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let day
  let letter
  rl.question('What day are you on?', function (d) {
      rl.question('a or b?', function (l) {
        day = d
        letter = l
        rl.close()
      })
  })

  rl.on('close', () => {
    console.log(main(day,letter))
  })
}

const main = (day, letter) => {
  const text = fs.readFileSync(`./day${day}/text.txt`).toString('utf-8')
  const inputArray = text.split('\n')

  const runDay = require(`./day${day}/${letter}`).default
  return 'Answer: ' + runDay(inputArray)
}

run()