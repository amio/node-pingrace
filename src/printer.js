import { parseStatics } from './parser'
const padStart = require('lodash.padstart')
const padEnd = require('lodash.padend')

export function printStaticsTable (results) {
  // parse raw results and sort
  results = results.map(result => parseStatics(result)).sort((a, b) => {
    const [al, bl] = [parseFloat(a.lossRate), parseFloat(b.lossRate)]
    return al === bl ? (a.avg - b.avg) : (al - bl)
  })

  const hostMaxLength = results.reduce(function (prev, curr) {
    return curr.host.length > prev ? curr.host.length : prev
  }, 0)

  // print title
  let title = padStart(
    `. . . . . RACING RESULT (${results.length}) . . . . .`,
    Math.floor(hostMaxLength / 2) + 40,
    ' '
  )
  process.stdout.write(`\n${title}\n\n`)

  // print headers
  printStaticsTableRow({
    host: '',
    lossRate: 'loss',
    avg: 'avg(ms)',
    deviation: 'deviation',
    stddev: 'stddev(ms)'
  }, hostMaxLength)

  // print table rows
  results.forEach(result => printStaticsTableRow(result, hostMaxLength))

  process.stdout.write('\n')
}

function printStaticsTableRow (statics, hostMaxLength) {
  const {avg, min, max} = statics
  if (!statics.deviation) {
    statics.deviation = ('± ' + (Math.abs((avg * 2) - min - max) / avg)).slice(0, 6) + '%'
  }
  process.stdout.write([
    padEnd(statics.host, hostMaxLength, ' '),
    padStart(statics.lossRate, 10, ' '),
    padStart(Math.round(avg) || avg, 10, ' '),
    padStart(statics.deviation, 12, ' '),
    padStart(statics.stddev, 12, ' ')
  ].join('') + '\n')
}
