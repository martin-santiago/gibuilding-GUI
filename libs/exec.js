const exec = require('child_process').exec

function execute (command, callback, ignore_trigger = false) {
  exec(command, (error, stdout, stderr) => {
    if (!ignore_trigger) {
      callback(stdout)
      if (error && !ignore_trigger) {
        console.error(`exec error: ${error}`)
      } else if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
    }
  })
};

module.exports = execute
