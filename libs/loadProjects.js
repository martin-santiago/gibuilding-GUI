const execute = require('./exec.js')
const os = require('os')
const { loadProjectCards, loadOpenButtonsLogic } = require('./buttonsLogic')

function loadProjects () {
  const command = os.platform() === 'win32' ? 'dir /B' : 'ls'
  execute(`cd gitbuilding-projects && ${command}`, (projects) => {
    loadProjectCards(projects)
    loadOpenButtonsLogic()
    loadDeleteButtonsLogic()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const createProjectFormButton = document.getElementById('create-project-form-button')
  const cancelProjectFormButton = document.getElementById('cancel-project-form-button')
  const projectForm = document.getElementById('project-form')

  const createProjectSubmitButton = document.getElementById('create-project-submit-button')

  createProjectFormButton.addEventListener('click', () => {
    projectForm.classList.toggle('d-none')
    document.getElementById('project-name').value = ''
  })

  cancelProjectFormButton.addEventListener('click', () => {
    projectForm.classList.toggle('d-none')
    document.getElementById('project-name').value = ''
  })

  createProjectSubmitButton.addEventListener('click', () => {
    const projectName = document.getElementById('project-name').value
    if (projectName !== '') {
      execute(`cd gitbuilding-projects && mkdir ${projectName} && cd ${projectName} && gitbuilding new`, (output) => {
        refreshProjects()
      })
    } else {
      console.log('invalid project name')
    }

    projectForm.classList.toggle('d-none')
    document.getElementById('project-name').value = ''
  })
  refreshProjects()
})

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

function refreshProjects () {
  const gitbuildingProjectCards = document.getElementById('gitbuilding-projects-cards')
  gitbuildingProjectCards.innerHTML = ''
  loadProjects()
}
