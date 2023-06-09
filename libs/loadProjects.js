const { loadProjectCards, loadOpenButtonsLogic } = require('./buttonsLogic')
const os = require('os')
const execute = require('./exec.js')

function loadProjects () {
  const command = os.platform() === 'win32' ? 'dir /B' : 'ls'
  execute(`cd gitbuilding-projects && ${command}`, (projects) => {
    loadProjectCards(projects)
    loadOpenButtonsLogic()
    loadDeleteButtonsLogic()
  })
}

function refreshProjects () {
  const gitbuildingProjectCards = document.getElementById('gitbuilding-projects-cards')
  gitbuildingProjectCards.innerHTML = ''
  loadProjects()
}

// TODO: change this function to buttonsLogic.js
function loadDeleteButtonsLogic () {
  const deleteProjectButtons = document.querySelectorAll('.delete-project-button')
  deleteProjectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectName = button.getAttribute('projectName')
      let command = ''
      if (os.platform() === 'win32') {
        command = `rd /s /q "gitbuilding-projects/${projectName.trim()}"`
      } else {
        command = `cd gitbuilding-projects && rm -rf ${projectName.trim()}`
      }
      execute(command, () => {
        refreshProjects()
      })
    })
  })
}

module.exports = refreshProjects
