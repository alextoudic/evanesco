const name = require('../package.json').name
const fs = require('fs')
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = require('../../../tools/exec')

console.log('Building CommonJS modules ...')

exec('babel ./src -d ./lib --ignore __tests__', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding ES modules ...')

exec('babel ./src -d ./lib/es --ignore __tests__', {
  BABEL_ENV: 'es'
})

console.log(`\nBuilding ${name}.js ...`)

exec(`rollup -c -f umd -o ./lib/umd/${name}.js`, {
  BABEL_ENV: 'umd',
  NODE_ENV: 'development'
})

console.log(`\nBuilding ${name}.min.js ...`)

exec(`rollup -c -f umd -o ./lib/umd/${name}.min.js`, {
  BABEL_ENV: 'umd',
  NODE_ENV: 'production'
})

const size = gzipSize.sync(fs.readFileSync(`./lib/umd/${name}.min.js`))

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
