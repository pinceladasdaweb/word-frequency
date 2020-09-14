const path = require('path')
const fn = require('./concerns')
const { sortBy } = require('lodash')
const { toArray, map } = require('rxjs/operators')
const folder = path.join(__dirname, '..', 'subtitles')
const symbols = ['.', '?', '!', '-', ',', '"', '♪', '&', '_', '<i>', '</i>', '\r', '[', ']', '(', ')']

fn.readDir(folder)
  .pipe(
    fn.filesFilter('.srt'),
    fn.readFile(),
    fn.separateBy('\n'),
    fn.removeEmpty(),
    fn.removeOnlyNumbers(),
    fn.removeChars(symbols),
    fn.separateBy(' '),
    fn.removeEmpty(),
    fn.removeOnlyNumbers(),
    toArray(),
    fn.groupBy(),
    map(arr => sortBy(arr, el => -el.qty))
  )
  .subscribe(console.log)

