const execute = require('./exec.js')
const killPorts = require('./utils.js')
const { ipcRenderer } = require('electron')

function loadProjectCards (projects) {
  const projectList = projects.split('\n').filter(item => item !== '')
  const gitbuildingProjectCards = document.getElementById('gitbuilding-projects-cards')
  projectList.forEach(project => {
    const projectCardDiv = document.createElement('div')
    projectCardDiv.innerHTML = `
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${project}</h5>
            <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div class="d-flex justify-content-between">
              <div class="open-project-button btn btn-primary" projectName="${project}">Open Project</div>
              <div class="delete-project-button btn btn-danger" projectName="${project}">Delete</div>
            </div>
          </div>
        </div>
      </div>
    `
    gitbuildingProjectCards.appendChild(projectCardDiv)
  })
}

function loadOpenButtonsLogic () {
  const openProjectButtons = document.querySelectorAll('.open-project-button')
  openProjectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectName = button.getAttribute('projectName')
      button.innerHTML = '<img src="assets/images/spinner.gif" alt="spinner" width="20" height="20">'
      killPorts()
      execute(`cd gitbuilding-projects && cd ${projectName.trim()} && gitbuilding serve`, () => {})
      const sendMessageToMain = () => {
        ipcRenderer.send('open-project', 'open')
        button.innerHTML = 'Open Project'
      }
      setTimeout(sendMessageToMain, 4000)
    })
  })
}

module.exports = { loadProjectCards, loadOpenButtonsLogic }
