const spinner = require('ora')()
const spawn = require('child_process').spawn
import { parseLog } from './parser'

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
      cp.on('close', (code) => {
        if (code === 0) {
          resolve(parseLog(log).statics)
        } else {
          resolve({code: code, msg: `Ping ${host} exited with code ${code}`})
        }
      })
    })
  })).then(results => {
    spinner.stop()
    results.map(result => {
      console.log('\n', result)
    })
  }).catch(reason => {
    console.error(reason)
  })
}
