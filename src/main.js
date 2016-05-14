const spinner = require('ora')()
const spawn = require('child_process').spawn
import { parseLog, parseStatics } from './parser'
import padStart from 'lodash/padStart'
import padEnd from 'lodash/padEnd'

export default function (hosts, flags) {
  const count = flags.count ? parseInt(flags.count) : 10
  const total = hosts.length * count
  let tripsCount = 0
  let progress = ''
  spinner.start()
  spinner.text = `${tripsCount}/${total} ${progress}`

  Promise.all(hosts.map(host => {
    let log = ''
    return new Promise((resolve, reject) => {
      const cp = spawn('ping', [`-c${count}`].concat(host))
      cp.stdout.on('data', data => {
        log += data.toString()
        tripsCount += 1
        progress += '='
        spinner.text = `${tripsCount}/${total} ${progress}`
      })
      cp.on('close', code => resolve(parseLog(log).statics))
    })
  })).then(results => {
    spinner.stop()
    printStaticsTable(results)
  }).catch(reason => {
    process.stdout.write(reason)
    process.exit(1)
  })
}

function printStaticsTable (results) {
  const title = `. . . . . . . RACING RESULT (${results.length}) . . . . . . .`
  process.stdout.write(`\n                ${title}\n\n`)

  const headers = {
    host: '',
    lossRate: 'loss',
    avg: 'avg(ms)',
    min: 'min(ms)',
    max: 'max(ms)',
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
  process.stdout.write([
    padEnd(statics.host, 20, ' '),
    padStart(statics.lossRate, 12, ' '),
    padStart(statics.min, 12, ' '),
    padStart(statics.avg, 12, ' '),
    padStart(statics.max, 12, ' '),
    padStart(statics.stddev, 12, ' ')
  ].join('') + '\n')
}