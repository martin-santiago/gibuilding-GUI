const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const killPorts = require('./libs/utils.js')

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, 'GitBuilding500x.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'libs/preload.js')
    }
  })

  window.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  killPorts()
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
