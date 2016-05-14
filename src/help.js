const path = require('path')

const helpText = `
  Usage
    $ pingrace <host> [<host>...]

  Options
    -c, --count  Ping every host a specific number of times (default: 10)

  Examples
    $ pingrace a.example.com b.example.com c.example.com
    $ pingrace -c 10 a.example.com b.example.com c.example.com
`

export function printHelp () {
  process.stdout.write(helpText)
}

export function printVersion () {
  const version = 'v' + require(path.join(__dirname, '../package.json')).version
  process.stdout.write(version + '\n')
}
