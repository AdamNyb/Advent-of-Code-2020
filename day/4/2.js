const useTheJson = require('./text.json')

module.exports = {
  default: (input) => {
    // Our input is a text split by newline
    // e.g. [ 'byr:1971', 'eyr:2039', '', 'hgt:172in']
    // but we want to join passport-details and only separate different passports
    // e.g. [ ['byr:1971', 'eyr:2039'], ['hgt:172in'] ]
    let passportArrays = []
    input.reduce((acc, curr, i) => {
      if (!curr) {
        passportArrays.push(acc)
        acc = []
        return acc
      }
      acc.push(curr)

      if (i === input.length - 1) {
        passportArrays.push(acc)
      }

      return acc
    }, [])

    // Array of passport objects
    const passports = passportArrays.map(passportFields => {
      const passport = {}
      passportFields
        .join(' ')
        .split(' ')
        .forEach(field => {
          const [key, value] = field.split(':')
          passport[key] = value
        })
      return passport
    })

    const { validPassports, invalidPassports } = validatePassports(useTheJson)

    return validPassports.length
  }
}

const validatePassports = (passports) => {
  const valids = []
  const invalids = []

  passports.forEach(passport => {
    validatePassport(passport)
      ? valids.push(passport)
      : invalids.push(passport)
  })

  return {
    validPassports: valids,
    invalidPassports: invalids
  }
}

/**
  byr (Birth Year)
  iyr (Issue Year)
  eyr (Expiration Year)
  hgt (Height)
  hcl (Hair Color)
  ecl (Eye Color)
  pid (Passport ID)
  cid (Country ID) - optional
 */
const validatePassport = (passport) => {
  let {
    byr,
    iyr,
    eyr,
    hgt,
    hcl,
    ecl,
    pid,
  } = passport
  

  const hasYears = byr && iyr && eyr
  if (!hasYears) {
    console.log('Not valid for passport nr. ' + (pid || '<No pid>'))
    return false
  }

  const byrInt = parseInt(byr)
  const iyrInt = parseInt(iyr)
  const eyrInt = parseInt(eyr)
  const byrValid = byrInt >= 1920 && byrInt <= 2002
  const iyrValid = iyrInt >= 2010 && iyrInt <= 2020
  const eyrValid = eyrInt >= 2020 && eyrInt <= 2030

  if (!(byrValid && iyrValid && eyrValid)) return false

  const hasAppearance = hgt && hcl && ecl
  if (!hasAppearance) {
    console.log('Invalid appearance', hgt, hcl, ecl)
    console.log('Passport nr. ' + (pid || '<No pid>'))
    return false
  }
  const hgtValid = () => {
    const hasUnit = /cm|in/.test(hgt) 
    if (!hasUnit) return false

    const unit = hgt.match(/cm|in/)[0]
    const value = parseInt(hgt)

    if (unit === 'cm') {
      return value >= 150 && value <= 193
    } else if (unit === 'in') {
      return value >= 59 && value <= 76
    }
    return false
  }
  if (!hgtValid()) {
    console.log('Invalid height', hgt)
    console.log('Passport nr. ' + (pid || '<No pid>'))
    return false
  }
  // must be hexcode
  const hclValid = /#([0-9a-f]{6})/.test(hcl)
  if (!hclValid) {
    console.log('Invalid haircolor', hcl)
    console.log('Passport nr. ' + (pid || '<No pid>'))
    return false
  }
  const eclValid = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl)
  if (!eclValid) {
    console.log('Invalid eyecolor', ecl)
    console.log('Passport nr. ' + (pid || '<No pid>'))
    return false
  }
  const pidValid = /\d{9}/.test(pid)
  if (!pidValid) {
    console.log('Invalid pid', pid)
    console.log('Passport nr. ' + (pid || '<No pid>'))
    return false
  }

  const isValid = byrValid
    && iyrValid 
    && eyrValid
    && hgtValid()
    && hclValid
    && eclValid
    && pidValid  

  return isValid
}