import main from './main'
import { printHelp, printVersion } from './help'

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
    c: 'count'
  }
})

if (argv.version) {
  printVersion()
  process.exit()
}

if (argv.help || argv._.length === 0) {
  printHelp()
  process.exit()
}

main(argv._, argv)
