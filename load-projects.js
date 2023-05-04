const exec = require('child_process').exec
const { ipcRenderer } = require('electron')

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

function loadProjects (projects) {
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
  const openProjectButtons = document.querySelectorAll('.open-project-button')
  openProjectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectName = button.getAttribute('projectName')
      execute('lsof -i :6178', (output) => {
        if (output !== '') {
          execute('kill $(lsof -t -i:6178)', (output) => {
            console.log('killing gitbuilding 6178 port, Goodbye')
          })
        }
      })
      execute(`cd gitbuilding-projects/${projectName} && gitbuilding serve`, (output) => {
        console.log(`running: cd gitbuilding-projects/${projectName} && gitbuilding serve`)
      })

      const sendMessageToMain = () => {
        ipcRenderer.send('open-project', 'open')
      }

      setTimeout(sendMessageToMain, 3000)
    })
  })
  const deleteProjectButtons = document.querySelectorAll('.delete-project-button')
  deleteProjectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectName = button.getAttribute('projectName')
      execute(`cd gitbuilding-projects && rm -rf ${projectName}`, (output) => {
        refreshProjects()
      })
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  execute('cd gitbuilding-projects && ls', (output) => {
    loadProjects(output)
  })

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
    console.log(projectName)
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
})

function refreshProjects () {
  const gitbuildingProjectCards = document.getElementById('gitbuilding-projects-cards')
  gitbuildingProjectCards.innerHTML = ''
  execute('cd gitbuilding-projects && ls', (output) => {
    loadProjects(output)
  })
}
