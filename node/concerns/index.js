const fs = require('fs')
const path = require('path')

const readDir = (folder) => {
  return new Promise ((resolve, reject) => {
    try {
      const files = fs.readdirSync(folder).map(file => path.join(folder, file))

      resolve(files)
    } catch (err) {
      reject(err)
    }
  })
}

const readFiles = (files) => Promise.all(files.map(file => readFile(file)))

const readFile = (file) => {
  return new Promise ((resolve, reject) => {
    try {
      const content = fs.readFileSync(file, { encoding: 'utf-8' })

      resolve(content.toString())
    } catch (err) {
      reject(err)
    }
  })
}

const mergeContent = arr => arr.join(' ')

const separateBy = symbol => text => text.split(symbol)

const filesFilter = ext => arr => arr.filter(el => el.endsWith(ext)) 

const removeEmpty = arr => arr.filter(el => el.trim())

const removeWithPattern = pattern => arr => arr.filter(el => !el.includes(pattern))

const removeOnlyNumbers = arr => arr.filter(el => isNaN(el))

const removeChars = chars => arr => arr.map(el => chars.reduce((acc, char) => acc.split(char).join('').trim(), el))

const groupBy = (words) => Object.values(words.reduce((acc, word) => {
  const w = word.toLowerCase()
  const qty = acc[w] ? acc[w].qty + 1 : 1

  acc[w] = { word: w, qty}

  return acc
}, {}))

const orderBy = (attr, order = 'asc') => {
  return arr => {
    const asc = (o1, o2) => o1[attr] - o2[attr]
    const desc = (o1, o2) => o2[attr] - o1[attr]

    return arr.sort(order === 'asc' ? asc : desc)
  }
}

module.exports = {
  readDir,
  groupBy,
  orderBy,
  readFiles,
  separateBy,
  filesFilter,
  removeEmpty,
  removeChars,
  mergeContent,
  removeWithPattern,
  removeOnlyNumbers
}
