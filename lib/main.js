const spawn = require('child_process').spawn
const spinner = require('ora')()

module.exports = function (hosts, flags) {
  const total = hosts.length * parseInt(flags.count)
  let count = 0
  let progress = ''
  spinner.start()
  spinner.text = `${count}/${total} ${progress}`

  Promise.all(hosts.map(host => {
    return new Promise((resolve, reject) => {
      let result = ''
      const cp = spawn('ping', [`-c${flags.count}`].concat(host))
      cp.stdout.on('data', data => {
        result = data.toString().trim()
        count += 1
        progress += '='
        spinner.text = `${count}/${total} ${progress}`
      })
      cp.stderr.on('data', data => {
        console.log('000000', data)
      })
      cp.on('close', (code) => {
        if (code === 0) {
          resolve(result)
        } else {
          resolve({code: code, msg: `Ping ${host} exited with code ${code}`})
        }
      })
    })
  })).then(results => {
    spinner.stop()
    results.map(result => {
      console.log('\n', result, '\n')
    })
  }).catch(reason => {
    console.error(reason)
  })
}
