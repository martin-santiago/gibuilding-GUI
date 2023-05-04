const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
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

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, 'GitBuilding500x.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'load-projects.js')
    }
  })

  window.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  execute('kill $(lsof -t -i:6178)', (output) => {
    console.log('killing gitbuilding 6178 port, Goodbye')
  })
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('open-project', (event, arg) => {
  if (arg === 'open') {
    const projectWindow = new BrowserWindow({
      width: 800,
      height: 800,
      minWidth: 1000,
      minHeight: 600,
      icon: path.join(__dirname, 'GitBuilding500x.png')
    })
    projectWindow.loadURL('http://localhost:6178')
  }
})
