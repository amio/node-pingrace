const spinner = require('ora')()
const spawn = require('child_process').spawn
import { parseLog } from './parser'
import { printStaticsTable } from './printer'

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
