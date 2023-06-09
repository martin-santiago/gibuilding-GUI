const execute = require('./exec.js')
const refreshProjects = require('./loadProjects')

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
