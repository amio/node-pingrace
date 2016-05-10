var NODE_MAJOR = parseInt(process.version.match(/^v(\d+)\./)[1])
require('babel-register')({
  presets: [NODE_MAJOR === 6 ? 'node6' : 'es2015']
})

var meow = require('meow')
var main = require('./lib/main')

var minimistOptions = {
  alias: { c: 'count' }
}

var cli = meow(`
	Usage
	  $ foo <input>

	Options
	  -c, --count  Ping every host a specific number of times

	Examples
	  $ foo unicorns --rainbow
`, minimistOptions)

main(cli.input, cli.flags)
