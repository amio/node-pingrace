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
    return new Promise((resolve, reject) => {
      const cp = spawn('ping', [`-c${count}`].concat(host))
      let log = ''
      cp.stdout.on('data', data => {
        log += data.toString()
        tripsCount += 1
        progress += '='
        spinner.text = `${tripsCount}/${total} ${progress}`
      })
      cp.stderr.on('data', data => (log += data.toString()))
      cp.on('close', code => {
        switch (code) {
          case 68:
            // ping: cannot resolve <host>: Unknown host
            return reject(log)
          default:
            resolve(parseLog(log).statics)
        }
      })
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
