const spawn = require('child_process').spawn
import { parseLog } from './parser'
import { printStaticsTable } from './printer'
import spinner from './spinner'

export default function (hosts, flags) {
  const pingLogs = {}
  const count = flags.count ? parseInt(flags.count, 10) : 10
  spinner.start(count, hosts.length)

  Promise.all(hosts.map(host => {
    return new Promise((resolve, reject) => {
      pingLogs[host] = ''
      const cp = spawn('ping', [`-c${count}`].concat(host))
      cp.stdout.on('data', data => updateLog(pingLogs, host, data))
      cp.stderr.on('data', data => updateLog(pingLogs, host, data))
      cp.on('close', code => {
        switch (code) {
          case 68:
            /* eslint-disable prefer-promise-reject-errors */
            // ping: "cannot resolve <host>: Unknown host"
            return reject({code: code, msg: pingLogs[host]})
          default:
            return resolve(parseLog(pingLogs[host]).statics)
        }
      })
    })
  })).then(results => {
    spinner.stop()
    printStaticsTable(results)
  }).catch(reason => {
    spinner.stop()
    process.stdout.write(reason.msg)
    process.exit(reason.code)
  })
}

function updateLog (logs, host, data) {
  logs[host] = logs[host] || ''
  logs[host] += data.toString()
  const tripsCount = Object.keys(logs).reduce((count, host) => {
    return count + (logs[host].match(/icmp_seq/g) || []).length
  }, 0)
  spinner.update(tripsCount)
}
