var meow = require('meow')
import main from './lib/main'

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
