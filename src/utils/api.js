export function getAllTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

export function deleteTask(id) {
  localStorage.setItem(
    'tasks',
    JSON.stringify(getAllTasks().filter((item) => item.id !== id)),
  );
}

export function addNewTask(task) {
  localStorage.setItem('tasks', JSON.stringify([...getAllTasks(), task]));
}

export function getTask(id) {
  return getAllTasks().find((item) => item.id === id);
}
