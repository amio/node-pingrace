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
    $ pingrace <host> [<host>...]

  Options
    -c, --count  Ping every host a specific number of times (default: 10)

  Examples
    $ pingrace a.example.com b.example.com c.example.com
    $ pingrace -c 10 a.example.com b.example.com c.example.com
`, minimistOptions)

main(cli.input, cli.flags)
