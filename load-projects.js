const exec = require('child_process').exec
const { ipcRenderer } = require('electron')
const os = require('os')
const { pid } = require('process')

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
      button.innerHTML = '<img src="spinner.gif" alt="spinner" width="20" height="20">'
      console.log(projectName)
      if (os.platform() == 'win32') {
        execute('netstat -ano | findstr :6178', (output) => {
          console.log('output:', output)
          if (output != '') {
            const pid = getListeningPid(output)
            console.log('pid:',pid)
            execute(`taskkill /PID ${pid} /F`)
          }
          execute(`cd gitbuilding-projects && cd ${projectName.trim()} && gitbuilding serve`, () =>  {
            console.log(`running: cd gitbuilding-projects/${projectName} && gitbuilding serve`)
          })
        })
      }
      else {
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
      }
      

      const sendMessageToMain = () => {
        ipcRenderer.send('open-project', 'open')
        button.innerHTML = 'Open Project'
      }

      setTimeout(sendMessageToMain, 4000)
    })
  })
  const deleteProjectButtons = document.querySelectorAll('.delete-project-button')
  deleteProjectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectName = button.getAttribute('projectName')
      if (os.platform() == 'win32') {
        execute(`rd /s /q "gitbuilding-projects/${projectName.trim()}"`, () => {})
        refreshProjects()
      }
      else {
        execute(`cd gitbuilding-projects && rm -rf ${projectName}`, (output) => {
          refreshProjects()
        })
      }

    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (os.platform() == 'win32') {
    execute('cd gitbuilding-projects && dir /B', (output) => {
      loadProjects(output)
    })
  }
  else {
    execute('cd gitbuilding-projects && ls', (output) => {
      loadProjects(output)
    })
  }

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
    execute('mkdir gitbuilding-projects', (output) => {})
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
})

function refreshProjects () {
  const gitbuildingProjectCards = document.getElementById('gitbuilding-projects-cards')
  gitbuildingProjectCards.innerHTML = ''
  if (os.platform() == 'win32') {
    execute('cd gitbuilding-projects && dir /B', (output) => {
      loadProjects(output)
    })
  }
  else {
    execute('cd gitbuilding-projects && ls', (output) => {
      loadProjects(output)
    })
  }
}

function getListeningPid(output) {
  const regex = /TCP\s.*:6178\s.*LISTENING\s+(\d+)/g;
  let match = regex.exec(output);
  return match ? match[1] : 'No match found';
}
