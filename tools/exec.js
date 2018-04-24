const execSync = require('child_process').execSync

module.exports = (command, envOverride) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, envOverride)
  })
