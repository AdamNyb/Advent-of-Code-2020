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

    const { validPassports, invalidPassports } = validatePassports(passports)

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
  const {
    byr,
    iyr,
    eyr,
    hgt,
    hcl,
    ecl,
    pid,
  } = passport

  const hasYears = byr && iyr && eyr
  const hasAppearance = hgt && hcl && ecl
  const hasId = pid

  const isValid = hasYears && hasAppearance && hasId
  if (!isValid && !passport.cid) {
    console.log('Not valid for passport nr. ' + (pid || '<No pid>'))
  }

  const unAllowedKeys = Object.keys(passport).filter(key => {
    const allowedKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid']
    return !allowedKeys.includes(key)
  }).join(' ')
  if (unAllowedKeys?.length) {
    console.log(unAllowedKeys)
  }


  return isValid
}