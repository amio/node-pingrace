// const fs = require('fs')
const program = require('commander')
const spawn = require('child_process').spawn;

program
  .version(require('./package.json').version)
  .option('-c, --count', 'Ping every host a specific number of times')
  .parse(process.argv)

const opts = program.args.filter(arg => /^-/.test(arg))
const hosts = program.args.filter(arg => !/^-/.test(arg))

Promise.all(hosts.map(host => {
  return new Promise((resolve, reject) => {
    let result = ''
    const cp = spawn('ping', [].concat(opts, host))
    cp.stdout.on('data', data => result = data.toString().trim())
    cp.on('close', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        resolve({code: code, msg: `Ping ${host} exited with code ${code}`})
      }
    })
  })
})).then(results => {
  results.map(result => {
    console.log(result, '\n')
  })
}).catch(reason => {
  console.error(reason)
})
