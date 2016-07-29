import padEnd from 'lodash/padEnd'
const spinner = require('ora')()

const config = {
  hosts: 0,
  count: 0
}

function start (pingCount, hosts) {
  config.hosts = hosts
  config.count = pingCount

  spinner.start()
  spinner.text = `0/${config.count}`
}

function update (doneCount) {
  const done = Math.floor(doneCount / config.hosts)
  const progress = padEnd(padEnd('', done, '='), config.count, '.')
  spinner.text = `${done}/${config.count} ${progress}`
}

function stop () {
  spinner.stop()
}

export default {
  start,
  update,
  stop
}
