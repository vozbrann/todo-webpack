import 'bootstrap';
import './scss/custom.scss';

document.addEventListener("DOMContentLoaded", ready);

function ready() {
    refreshTasks();
    addControlEventListeners();
    addModalsEventListeners();
    addTasksEventListeners();
}

function addControlEventListeners() {
    document.querySelector('.control').onclick = function (e) {
        if (e.target) {
            if (e.target.matches(".create")) {
                showModal();
            }
        }
    }
    document.querySelector('.search').addEventListener('input', function (event) {
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
        } else if (a.isDone > b.isDone) {
            return 1;
        }
        return -1;
    });
}

function createTaskHTMLElement({id, title, description, priority, isDone}) {
    return `
        <div class="col-lg-4 mb-3 task">
                
                ${isDone && `<div class="shadow-sm bg-light p-3">` || `<div class="shadow-sm p-3">`}
                    <div class="row">
                        <div class="col-9">
                            <h5 class="title text-wrap text-break">${title}</h5>
                        </div>
                        ${isDone && `
                            <div class="col-3">
                                <img src="http://www.pngmart.com/files/3/Green-Tick-Transparent-PNG.png" width="40px" alt="">
                            </div>` || ``
    }
                    </div>
                    <p class="descriptionText text-wrap text-break">${description}</p>
                    <div class="interact">
                        <div class="row">
                            <div class="col">
                                <span class="btn bg-secondary text-white btn-sm">${priority === 3 ? "High" : priority === 2 ? "Normal" : "Low"}</span>
                            </div>
                            <div class="col d-flex justify-content-end">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-secondary btn-sm px-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        ...
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <button class="dropdown-item isDone" data_id="${id}" type="button">Done</button>
                                        <button class="dropdown-item edit" data-toggle="modal"
                                            data-target="#taskModal" data_id="${id}" type="button">Edit</button>
                                        <button class="dropdown-item delete" data_id="${id}" type="button">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `
}

function refreshTasks() {
    let taskRow = document.querySelector('.taskListRow');
    taskRow.innerHTML = '';

    let tasks = defaultSort(getAllTasksFromLocalStorage());

    let searchVal = document.querySelector('.search').value;
    if (searchVal) {
        tasks = tasks.filter(a => (a.title.includes(searchVal)));
    }
    tasks.forEach(item => {
        taskRow.innerHTML += createTaskHTMLElement(item);
    });
    addTasksEventListeners();
}

function addTasksEventListeners() {
    let taskList = document.querySelector('.taskListRow');
    taskList.onclick = function (e) {
        if (e.target.matches(".delete")) {
            const id = e.target.attributes.data_id.value;
            deleteTask(id);
            refreshTasks();
        } else if (e.target.matches(".edit")) {
            const id = e.target.attributes.data_id.value;
            showModal(id);
        } else if (e.target.matches(".isDone")) {
            const id = e.target.attributes.data_id.value;
            changeTaskStatus(id);
            refreshTasks();
        }
    }
}

function changeTaskStatus(id) {
    localStorage.setItem('tasks', JSON.stringify(getAllTasksFromLocalStorage().map(item => {
        if (item.id === id) {
            return {
                ...item,
                isDone: !item.isDone
            };
        }
        return item;
    })));
}

function showModal(id = null) {
    emptyModal();
    if (id) {
        const taskModal = document.querySelector('#taskModal');
        const {title, description, priority} = getTaskFromLocalStorage(id);

        taskModal.querySelector(".title").value = title || "";
        taskModal.querySelector(".description").value = description || "";
        taskModal.querySelector(".priority").value = priority || "";
    }

    addModalsEventListeners(id);

    const taskModalForm = document.querySelector('.taskModalForm');
    taskModalForm.classList.remove('was-validated');
}

function addModalsEventListeners(id = null) {
    let taskModalForm = document.querySelector('.taskModalForm');
    taskModalForm.onsubmit = function (e) {
        if (taskModalForm.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            taskModalForm.classList.add('was-validated');
            console.log("invalid")
        } else {
            console.log("valid")
            let title = taskModalForm.querySelector(".title").value;
            let description = taskModalForm.querySelector(".description").value;
            let priority = taskModalForm.querySelector(".priority").value;
            if (id) {
                deleteTask(id);
            }
            addNewTaskToLocalStorage({
                id: id || generateId(),
                title,
                description,
                priority,
                isDone: false
            });
            refreshTasks();
        }
    }
}

function generateId() {
    return `f${(+new Date).toString(16)}`;
}

function emptyModal() {
    let taskModalForm = document.querySelector('.taskModalForm');
    taskModalForm.querySelector(".title").value = '';
    taskModalForm.querySelector(".description").value = '';
    taskModalForm.querySelector(".priority").value = '3';
}

function deleteTask(id) {
    localStorage.setItem('tasks', JSON.stringify(getAllTasksFromLocalStorage().filter(item => item.id !== id)));
}

function getAllTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function addNewTaskToLocalStorage(task) {
    localStorage.setItem('tasks', JSON.stringify([...getAllTasksFromLocalStorage(), task]));
}

function getTaskFromLocalStorage(id) {
    return getAllTasksFromLocalStorage().find(item => item.id === id);
}


