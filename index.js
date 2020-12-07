const readline = require('readline')
const fs = require('fs')

function run () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let day
  let part
  rl.question('What day are you on?\n', function (d) {
      rl.question('Part 1 or 2?\n', function (p) {
        day = d
        part = p
        rl.close()
      })
  })

  rl.on('close', () => {
    console.log(main(day,part))
  })
}

const main = (day, part) => {
  const text = fs.readFileSync(`./day/${day}/text.txt`).toString('utf-8')
  const inputArray = text.split('\n')

  const runDay = require(`./day/${day}/${part}`).default
  return 'Answer: ' + runDay(inputArray)
}

run()