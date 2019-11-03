import 'bootstrap';
import './scss/custom.scss';
import {
  deleteTask,
  addNewTask,
  getAllTasks,
  getTask,
} from './utils/interface';

document.addEventListener('DOMContentLoaded', ready);

function ready() {
  refreshTasks();
  addControlEventListeners();
  addModalsEventListeners();
  addTasksEventListeners();
}

function addControlEventListeners() {
  document.querySelector('.control').onclick = (e) => {
    if (e.target) {
      if (e.target.matches('.create')) {
        showModal();
      }
    }
  };
  document.querySelector('.control').addEventListener('input', () => {
    refreshTasks();
  });
}

function defaultSort(list) {
  return list.sort((a, b) => {
    if (a.isDone === b.isDone) {
      if (a.priority > b.priority) {
        return -1;
      }
      return 1;
    }
    if (a.isDone > b.isDone) {
      return 1;
    }
    return -1;
  });
}

function createTaskHTMLElement({
  id, title, description, priority, isDone,
}) {
  return `
        <div class="col-lg-4 mb-3 task">
          ${(isDone && '<div class="shadow-sm bg-light p-3 h-100">')
            || '<div class="shadow-sm p-3 h-100">'}
            <div class="row h-100">
              <div class="col-12">
                <div class="row">
                    <div class="col-9">
                        <h5 class="title text-wrap text-break">${title}</h5>
                    </div>
                    ${(isDone && `
                        <div class="col-3">
                            <img src="http://www.pngmart.com/files/3/Green-Tick-Transparent-PNG.png" width="40px" alt="">
                        </div>`) || ''}
                </div>
                <p class="descriptionText text-wrap text-break">${description}</p>
              </div>
              <div class="col-12 align-self-end interact">
                  <div class="row">
                      <div class="col">
                          ${
                            priority === '2'
                              ? '<span class="btn bg-danger text-white btn-sm">High</span>'
                              : priority === '1'
                              ? '<span class="btn bg-warning text-white btn-sm">Normal</span>'
                              : '<span class="btn bg-primary text-white btn-sm">Low</span>'
                          }
                      </div>
                      <div class="col d-flex justify-content-end">
                          <div class="btn-group">
                              <button type="button" class="btn btn-secondary btn-sm px-2 " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  ...
                              </button>
                              <div class="dropdown-menu dropdown-menu-right">
                                  ${(!isDone && `<button class="dropdown-item isDone" data_id="${id}" type="button">Done</button>`) || (`<button class="dropdown-item isDone" data_id="${id}" type="button">Undone</button>`)}
                                  ${(!isDone && `<button class="dropdown-item edit" data-toggle="modal"
                                      data-target="#taskModal" data_id="${id}" type="button">Edit</button>`) || ('')}
                                  <button class="dropdown-item delete" data_id="${id}" type="button">Delete</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
  
          </div>
        </div>
    `;
}

function searchByTitles(tasks) {
  const searchVal = document.querySelector('.search').value;
  if (searchVal) {
    return tasks.filter((a) => a.title.toLowerCase().includes(searchVal.toLowerCase()));
  }
  return tasks;
}

function filterByStatus(tasks) {
  const filterStatus = document.querySelector('.status').value;
  if (filterStatus === 'all') return tasks;
  if (filterStatus) {
    return tasks.filter((a) => a.isDone.toString() === filterStatus);
  }
  return tasks;
}

function filterByPriority(tasks) {
  const filterPriority = document.querySelector('.priority').value;
  if (filterPriority === 'all') return tasks;
  if (filterPriority) {
    return tasks.filter((a) => a.priority.toString() === filterPriority);
  }
  return tasks;
}

function refreshTasks() {
  const taskRow = document.querySelector('.taskListRow');
  taskRow.innerHTML = '';

  const tasks = defaultSort(getAllTasks());

  filterByPriority(filterByStatus(searchByTitles(tasks))).forEach((item) => {
    taskRow.innerHTML += createTaskHTMLElement(item);
  });
  addTasksEventListeners();
}

function addTasksEventListeners() {
  const taskList = document.querySelector('.taskListRow');
  taskList.onclick = (e) => {
    if (e.target.matches('.delete')) {
      const id = e.target.attributes.data_id.value;
      deleteTask(id);
      refreshTasks();
    } else if (e.target.matches('.edit')) {
      const id = e.target.attributes.data_id.value;
      showModal(id);
    } else if (e.target.matches('.isDone')) {
      const id = e.target.attributes.data_id.value;
      changeTaskStatus(id);
      refreshTasks();
    }
  };
}

function changeTaskStatus(id) {
  localStorage.setItem(
    'tasks',
    JSON.stringify(
      getAllTasks().map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isDone: !item.isDone,
          };
        }
        return item;
      }),
    ),
  );
}

function showModal(id = null) {
  emptyModal();
  if (id) {
    const taskModal = document.querySelector('#taskModal');
    const { title, description, priority } = getTask(id);

    taskModal.querySelector('.title').value = title || '';
    taskModal.querySelector('.description').value = description || '';
    taskModal.querySelector('.priority').value = priority || '';
  }

  addModalsEventListeners(id);

  const taskModalForm = document.querySelector('.taskModalForm');
  taskModalForm.classList.remove('was-validated');
}

function addModalsEventListeners(id = null) {
  const taskModalForm = document.querySelector('.taskModalForm');
  taskModalForm.onsubmit = (e) => {
    if (taskModalForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      taskModalForm.classList.add('was-validated');
    } else {
      const title = taskModalForm.querySelector('.title').value;
      const description = taskModalForm.querySelector('.description').value;
      const priority = taskModalForm.querySelector('.priority').value;
      if (id) {
        deleteTask(id);
      }
      addNewTask({
        id: id || generateId(),
        title,
        description,
        priority,
        isDone: false,
      });
      refreshTasks();
    }
  };
}

function generateId() {
  return `f${(+new Date()).toString(16)}`;
}

function emptyModal() {
  const taskModalForm = document.querySelector('.taskModalForm');
  taskModalForm.querySelector('.title').value = '';
  taskModalForm.querySelector('.description').value = '';
  taskModalForm.querySelector('.priority').value = 2;
}
