
const os = require('os')
const execute = require('./exec.js')

function getListeningPid (output) {
  const regex = /TCP\s.*:6178\s.*LISTENING\s+(\d+)/g
  const match = regex.exec(output)
  return match ? match[1] : 'No match found'
}

function killPorts () {
  if (os.platform() === 'win32') {
    execute('netstat -ano | findstr :6178', (output) => {
      if (output !== '') {
        const pid = getListeningPid(output)
        execute(`taskkill /PID ${pid} /F`)
      }
    })
  } else {
    execute('lsof -i :6178', (output) => {
      if (output !== '') {
        execute('kill $(lsof -t -i:6178)', () => {})
      }
    })
  }
}

module.exports = killPorts
