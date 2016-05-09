const program = require('commander')
const spawn = require('child_process').spawn
const spinner = require('ora')()
// const parser = require('./lib/parser')

program
  .version(require('./package.json').version)
  .option('-c, --count <n>', 'Ping every host a specific number of times')
  .parse(process.argv)

const opts = program.args.filter(arg => /^-/.test(arg))
const hosts = program.args.filter(arg => !/^-/.test(arg))

// const total = hosts.length * parseInt(program.count, 10)
let count = 0
let progress = ''
spinner.start()

Promise.all(hosts.map(host => {
  return new Promise((resolve, reject) => {
    let result = ''
    const cp = spawn('ping', [].concat(opts, host))
    cp.stdout.on('data', data => {
      result = data.toString().trim()
      count += 1
      progress += '='
      spinner.text = `${count} ${progress}`
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
