const overlay = document.querySelector('.overlay')
const tasksForm = document.getElementById('tasks-form')
const addTaskBtn = document.getElementById('add-task')
const completedTasksBtn = document.getElementById('completed-tasks')
const addTaskExit = document.getElementById('add-task-exit')
const tasksList = document.querySelector('.tasks-list')
// Open / close modal

addTaskBtn.addEventListener('click', () => {
  overlay.classList.remove('element-hidden')
  tasksForm.classList.remove('element-hidden')
})

const completedPopup = document.querySelector('.completed-popup')
completedTasksBtn.addEventListener('click', () => {
  const completedList = document.querySelector('.completed-list')
  overlay.classList.remove('element-hidden')
  completedPopup.classList.remove('element-hidden')

  const completedTasksArray = tasks.filter((task) => task.completed)
  tasksRender(completedTasksArray, completedList)
})

document.addEventListener('click', (e) => {
  if (e.target === overlay || e.target === addTaskExit) {
    overlay.classList.add('element-hidden')
    tasksForm.classList.add('element-hidden')
    completedPopup.classList.add('element-hidden')
    taskFormCleaner()
  }
})

// TASKS FORM ELEMENTS
const taskTextInput = document.getElementById('task-text')
const taskRewardInput = document.getElementById('task-reward')
const taskDateInput = document.getElementById('task-date')
let today = new Date()
let dd = today.getDate()
if (dd < 10) dd = '0' + dd
let mm = today.getMonth() + 1
if (mm < 10) mm = '0' + mm
const yyyy = today.getFullYear()
today = yyyy + '-' + mm + '-' + dd
taskDateInput.setAttribute('min', today)
taskDateInput.setAttribute('value', today)

let tasks = []

function addTaskInfo(taskText, taskReward, taskDate, taskDiff) {
  tasks.push({
    id: Date.now(),
    text: taskText,
    reward: taskReward,
    date: taskDate,
    difficulty: taskDiff,
    completed: false,
  })
  console.log(tasks)
}

const diffButtons = document.querySelectorAll('.diff-btn')
let difficulty = 'medium'
diffButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    difficulty = btn.dataset.diff
  })
})

function taskFormCleaner() {
  tasksForm.reset()
  taskDateInput.value = today
  difficulty = 'medium'
}

tasksForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const textInputValue = taskTextInput.value
  if (!textInputValue) return
  const rewardInputValue = Number(taskRewardInput.value)
  const dateInputValue = taskDateInput.value
  addTaskInfo(textInputValue, rewardInputValue, dateInputValue, difficulty)
  tasksRender(
    tasks.filter((task) => !task.completed),
    tasksList,
  )
  taskFormCleaner()
})

function createTaskDOM() {
  const li = document.createElement('li')
  li.classList.add('tasks-item')
  const liInnerLeft = document.createElement('div')
  liInnerLeft.classList.add('task-left')
  const checkbox = document.createElement('span')
  checkbox.classList.add('task-checkbox')
  const spanText = document.createElement('span')
  spanText.classList.add('task-text')
  const liInnerRight = document.createElement('div')
  liInnerRight.classList.add('task-right')
  const spanXP = document.createElement('span')
  spanXP.classList.add('task-xp')
  const deleteBtn = document.createElement('button')
  deleteBtn.type = 'button'
  deleteBtn.classList.add('delete-btn')
  const deleteImg = document.createElement('img')
  deleteImg.src = './assets/trash.svg'
  deleteImg.classList.add('delete-img')
  deleteImg.alt = 'Кнопка удаления задачи'
  liInnerLeft.append(checkbox, spanText)
  deleteBtn.append(deleteImg)
  liInnerRight.append(spanXP, deleteBtn)
  li.append(liInnerLeft, liInnerRight)
  return { li, spanText, spanXP, checkbox }
}

function tasksRender(array, container) {
  container.innerHTML = ''
  array.forEach((task) => {
    const elements = createTaskDOM()
    elements.li.dataset.id = task.id
    if (task.completed) {
      elements.checkbox.classList.add('task-checkbox--completed')
      elements.li.classList.add('task-item--completed')
      elements.spanText.classList.add('task-text--completed')
    }

    elements.spanText.textContent = task.text
    elements.spanXP.textContent = `${task.reward} XP`
    container.append(elements.li)
  })
}

const time = document.querySelector('.header__time')

function updateDate() {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  time.textContent = `${today} ${hh}:${mm}:${ss}`
}

updateDate()

setInterval(updateDate, 1000)

document.addEventListener('click', (e) => {
  const liParent = e.target.closest('.tasks-item')
  if (!liParent) return
  const clickedId = Number(liParent.dataset.id)

  if (e.target.closest('.delete-btn')) {
    tasks = tasks.filter((task) => task.id !== clickedId)

    tasksRender(
      tasks.filter((t) => !t.completed),
      tasksList,
    )
    const completedList = document.querySelector('.completed-list')
    if (completedList)
      tasksRender(
        tasks.filter((t) => t.completed),
        completedList,
      )

    return
  }

  const checkbox = e.target.closest('.task-checkbox')
  if (checkbox || e.target.closest('.task-text')) {
    liParent.classList.add('fade-out')

    setTimeout(() => {
      tasks.forEach((task) => {
        if (task.id === clickedId) {
          task.completed = !task.completed
        }
      })

      tasksRender(
        tasks.filter((task) => !task.completed),
        tasksList,
      )
      const completedList = document.querySelector('.completed-list')
      if (completedList)
        tasksRender(
          tasks.filter((t) => t.completed),
          completedList,
        )
    }, 600)
  }
})
