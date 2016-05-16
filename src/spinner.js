import padEnd from 'lodash/padEnd'
const spinner = require('ora')()

const state = {
  hosts: 0,
  count: 0,
  totalCount: 0
}

function start (pingCount, hosts) {
  state.hosts = hosts
  state.count = pingCount
  state.totalCount = hosts * pingCount

  spinner.start()
  spinner.text = `0/${state.total}`
}

function update (doneCount) {
  const done = Math.round(doneCount / state.hosts)
  const progress = padEnd(padEnd('', done, '='), state.count, '.')
  spinner.text = `${done}/${state.count} ${progress}`
}

function stop () {
  spinner.stop()
}

export default {
  start,
  update,
  stop
}
