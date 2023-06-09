const exec = require('child_process').exec

function execute (command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout)
    if (error) {
      console.error(`exec error: ${error}`)
    } else if (stderr) {
      console.error(`stderr: ${stderr}`)
    }
  })
};

module.exports = execute
