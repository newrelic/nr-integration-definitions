const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const DEFINITIONS_DIR = '../definitions/'

module.exports = {
  getAllDefinitions: () => {
    return fs.readdirSync(DEFINITIONS_DIR).map(file => {
      const filename = path.resolve(DEFINITIONS_DIR, file)
      return yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
    })
  },
  isLowerCamelCase: str => {
    // Let's start simple by just checking that the first char is a number or
    // it's not upper cased
    const firstChar = str[0]
    return module.exports.isNumber(firstChar)
      || firstChar !== firstChar.toUpperCase()
  },
  isNumber: str => {
    return !isNaN(str)
  },
  teamStoreKey(team) {
    switch(team) {
      case 'beyond':
        return 'BEYOND'
      case 'caos':
        return 'CAOS'
      case 'fsi':
        return 'FSI'
      case 'integrations':
        return 'COREINT'
      default:
        return 'UNKNOWN'
    }
  }
}
