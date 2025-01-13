// Handle adding tasks to lanes
document.getElementById('todo-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const taskInput = document.getElementById('todo-input');
  const taskText = taskInput.value.trim();

  if (taskText) {
    const todoList = document.getElementById('todo-list');
    const newTask = document.createElement('li');
    newTask.classList.add('task-item');
    newTask.textContent = taskText;
    
    // Add task to the To-Do lane
    todoList.appendChild(newTask);

    // Clear input field
    taskInput.value = '';
  }
});

// Allow tasks to be moved between lanes by drag-and-drop
document.addEventListener('DOMContentLoaded', () => {
  const lanes = document.querySelectorAll('.swim-lane');

  lanes.forEach(lane => {
    lane.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.style.backgroundColor = '#f1f1f1';
    });

    lane.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.style.backgroundColor = '#fff';
    });

    lane.addEventListener('drop', function(e) {
      e.preventDefault();
      const draggedTask = document.querySelector('.dragging');
      this.querySelector('.task-list').appendChild(draggedTask);
      this.style.backgroundColor = '#fff';
    });
  });
});

// Add a new swim lane dynamically
document.getElementById('add-lane').addEventListener('click', function() {
  const newLane = document.createElement('div');
  newLane.classList.add('swim-lane');
  
  const newHeading = document.createElement('h3');
  newHeading.classList.add('heading');
  newHeading.textContent = 'New Lane';
  newLane.appendChild(newHeading);
  
  const newTaskList = document.createElement('ul');
  newTaskList.classList.add('task-list');
  newLane.appendChild(newTaskList);

  document.getElementById('kanban-board').appendChild(newLane);
});
