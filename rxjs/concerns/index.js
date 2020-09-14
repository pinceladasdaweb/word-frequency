const fs = require('fs')
const path = require('path')
const { Observable } = require('rxjs')

const pipeableOperator = (fn) => {
  return (source) => {
    return Observable.create(function(observer) {
      const sub = fn(observer)

      source.subscribe({
        next: sub.next,
        error: sub.error || (e => observer.error(e)),
        complete: sub.complete || (e => observer.complete(e))
      })
    })
  }
}

const readDir = (folder) => {
  return new Observable(function subscribe(subscriber) {
    try {
      fs.readdirSync(folder).forEach(file => subscriber.next(path.join(folder, file)))

      subscriber.complete()
    } catch (err) {
      subscriber.error(err)
    }
  })
}

const readFile = () => {
  return pipeableOperator(subscriber => ({
    next(file) {
      try {
        const content = fs.readFileSync(file, { encoding: 'utf-8' })

        subscriber.next(content.toString())
      } catch (err) {
        subscriber.error(err)
      }
    }
  }))
}

const filesFilter = (ext) => {
  return pipeableOperator(subscriber => ({
    next(text) {
      if (text.endsWith(ext)) {
        subscriber.next(text)
      }
    }
  }))
}

const separateBy = (symbol) => {
  return pipeableOperator(subscriber => ({
    next(text) {
      text.split(symbol).forEach(fragment => {
        subscriber.next(fragment)
      })
    }
  }))
}

const removeEmpty = () => {
  return pipeableOperator(subscriber => ({
    next(text) {
      if (text.trim()) {
        subscriber.next(text)
      }
    }
  }))
}

const removeOnlyNumbers = () => {
  return pipeableOperator(subscriber => ({
    next(text) {
      const num = parseInt(text.trim())

      if (num !== num) {
        subscriber.next(text) 
      }
    }
  }))
}

const removeChars = (chars) => {
  return pipeableOperator(subscriber => ({
    next(text) {
      const newText = chars.reduce((acc, symbol) => {
        return acc.split(symbol).join('').trim()
      }, text)

      subscriber.next(newText)
    }
  }))
}

const groupBy = () => {
  return pipeableOperator(subscriber => ({
    next(words) {
      const group = Object.values(words.reduce((acc, word) => {
        const w = word.toLowerCase()
        const qty = acc[w] ? acc[w].qty + 1 : 1

        acc[w] = { word: w, qty}

        return acc
      }, {}))

      subscriber.next(group)
    }
  }))
}

module.exports = {
  groupBy,
  readDir,
  readFile,
  separateBy,
  filesFilter,
  removeEmpty,
  removeChars,
  removeOnlyNumbers
}
