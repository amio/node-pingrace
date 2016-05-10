import main from './src/main'
import printHelp from './src/print-help'

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    c: 'count'
  }
})

if (argv.help || argv._.length === 0) {
  printHelp()
  process.exit()
}

main(argv._, argv)
