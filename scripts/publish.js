const exec = require('../tools/exec')
const branch = require('git-branch').sync()

if (branch !== 'master' || branch !== 'next') {
  throw new Error('Publishing isnt allowed out branches master and next')
}

// exec()
