import { parseStatics } from './parser'
const padStart = require('lodash.padstart')
const padEnd = require('lodash.padend')

export function printStaticsTable (results) {
  const title = `. . . . . . RACING RESULT (${results.length}) . . . . . .`
  process.stdout.write(`\n             ${title}\n\n`)

  const headers = {
    host: '',
    lossRate: 'loss',
    avg: 'avg(ms)',
    deviation: 'deviation',
    stddev: 'stddev(ms)'
  }
  printStaticsTableRow(headers)
  results
    .map(result => parseStatics(result))
    .sort((a, b) => {
      const [al, bl] = [parseFloat(a.lossRate), parseFloat(b.lossRate)]
      return al === bl ? (a.avg - b.avg) : (al - bl)
    })
    .forEach(result => printStaticsTableRow(result))

  process.stdout.write('\n')
}

function printStaticsTableRow (statics) {
  const {avg, min, max} = statics
  if (!statics.deviation) {
    statics.deviation = ('± ' + Math.abs(avg * 2 - min - max) / avg).slice(0, 6) + '%'
  }
  process.stdout.write([
    padEnd(statics.host, 20, ' '),
    padStart(statics.lossRate, 12, ' '),
    padStart(Math.round(avg) || avg, 12, ' '),
    padStart(statics.deviation, 12, ' '),
    padStart(statics.stddev, 12, ' ')
  ].join('') + '\n')
}
