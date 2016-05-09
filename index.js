const meow = require('meow')
const main = require('./lib/main')

const cli = meow(`
	Usage
	  $ foo <input>

	Options
	  -c, --count  Ping every host a specific number of times

	Examples
	  $ foo unicorns --rainbow
`, {
	alias: {
		c: 'count'
	}
})

main(cli.input, cli.flags)
