const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const { readdir } = require('fs').promises

const DEFINITIONS_DIR = '../definitions/'

async function getFiles(dir) {
  const items = await readdir(dir, {withFileTypes: true})
  const files = await Promise.all(items.map((item) => {
      const res = path.resolve(dir, item.name);
      return item.isDirectory() ? getFiles(res) : res;
    }));
  return files.flat()
}

module.exports = {
  getAllDefinitions: (func) => {
    getFiles(DEFINITIONS_DIR).then(files => files.map(file => {
      yml = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      func(yml);
    })).catch(err => console.log(err));
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
