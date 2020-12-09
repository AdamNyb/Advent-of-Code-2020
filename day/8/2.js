module.exports = {
  default: (input) => {
    
    const program = new Program(input)

    if (!program.boot()) {
      return input.map((line, i) => {
        let inputClone = [...input]
        if (line.includes('acc')) {
          return 'skip'
        }

        inputClone[i] = /jmp/.test(line)
          ? inputClone[i].replace('jmp', 'nop')
          : inputClone[i].replace('nop', 'jmp')

        const testProgram = new Program(inputClone)
        if (testProgram.boot()) {
          return testProgram.accumulator
        }
      })
      .filter(output => output !== 'skip' && output !== undefined)

    }

  }
}

class Program {
  constructor(input) {
    this.accumulator = 0
    this.currentCommandLine = 0
    this.lineHistory = []
    this.rawCommands = input
    this.commands = this.loadCommands(input)
  }

  boot () {
    const doesItWork = this.executeCommand()
    return doesItWork
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

    // console.log('Running line:' + this.currentCommandLine + ', command:' + type + ' ' + value)

    if (type === 'acc') {
      this.accumulator += parseInt(value)
    }

    lineChange = type === 'jmp' ? value : 1

    this.moveCommandLine(lineChange)
    if (!this.isThereANextCommand()) {
      // console.log('no more commands')
      return true
    }

    try {
      return this.executeCommand()
    } catch (error) {
      throw new Error(error)
    }
  }

  moveCommandLine (lineChange) {
    this.lineHistory.push(this.currentCommandLine)
    
    // Can handle negative values
    // console.log('Moving command line')
    // console.log('from:' + this.currentCommandLine + ' to:' + lineChange)
    this.currentCommandLine += parseInt(lineChange)
  }

  hasCommandRunBefore () {
    // console.log('Have we been at line ' + this.currentCommandLine)
    // console.log(this.lineHistory)
    return this.lineHistory.includes(this.currentCommandLine)
  }

  executeRedAlert () {
    // console.error('Red alert! "I think we\'ve been here before..."')
    return false
  }

  isThereANextCommand () {
    return Object.keys(this.commands)
      .map(c => parseInt(c))
      .includes(this.currentCommandLine)
  }
  
}