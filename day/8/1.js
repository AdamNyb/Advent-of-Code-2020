module.exports = {
  default: (input) => {
    
    const program = new Program(input)

    console.log(program.boot())

  }
}

class Program {
  constructor(input) {
    this.accumulator = 0
    this.currentCommandLine = 0
    this.lineHistory = []
    this.commands = this.loadCommands(input)
  }

  boot () {
    this.executeCommand()
    return this.accumulator
  }

  loadCommands (input) {
    const commands = {}
    input.forEach((line, i) => {
      const [ type, value ] = line.split(' ')
      commands[i] = { type, value }
    })
    return commands
  }

  executeCommand () {
    if (this.hasCommandRunBefore()) {
      return this.executeRedAlert()
    }

    const { type , value } = this.commands[this.currentCommandLine]
    let lineChange

    console.log('Running line:' + this.currentCommandLine + ', command:' + type + ' ' + value)

    if (type === 'acc') {
      this.accumulator += parseInt(value)
    }

    lineChange = type === 'jmp' ? value : 1

    this.moveCommandLine(lineChange)
    if (this.isThereANextCommand()) {
      console.log('no more commands')
      return 
    }

    try {
      this.executeCommand()
    } catch (error) {
      console.log(error)
      return
    }
  }

  moveCommandLine (lineChange) {
    this.lineHistory.push(this.currentCommandLine)
    
    // Can handle negative values
    console.log('Moving command line')
    console.log('from:' + this.currentCommandLine + ' to:' + lineChange)
    this.currentCommandLine += parseInt(lineChange)
  }

  hasCommandRunBefore () {
    console.log('Have we been at line ' + this.currentCommandLine)
    console.log(this.lineHistory)
    return this.lineHistory.includes(this.currentCommandLine)
  }

  executeRedAlert () {
    return console.error('Red alert! "I think we\'ve been here before..."')
  }

  isThereANextCommand () {
    return Object.keys(this.commands).includes(this.currentCommandLine)
  }
  
}