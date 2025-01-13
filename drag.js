// Function to handle inserting a task in the right position within a lane based on mouse position
const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

// Handle drag events on swim lanes (allowing tasks to be rearranged)
const droppables = document.querySelectorAll(".swim-lane");

droppables.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });

  zone.addEventListener("dragenter", (e) => {
    e.preventDefault();
    zone.classList.add("drag-enter"); // Visual feedback for drag enter
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-enter"); // Remove visual feedback
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-enter");
    saveTasks(); // Save the task state after drop
  });
});

// Handle the task creation and drag behavior
const handleNewTask = (taskText, laneId) => {
  const task = document.createElement("li");
  task.classList.add("task");
  task.setAttribute("draggable", "true");
  task.textContent = taskText;
  task.addEventListener("dragstart", (e) => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });

  // Append the task to the specific lane
  document.getElementById(laneId).querySelector(".task-list").appendChild(task);
};

// Add new swim lane functionality with task creation
const addLaneBtn = document.getElementById("add-lane");
addLaneBtn.addEventListener("click", () => {
  const newLane = document.createElement("div");
  newLane.classList.add("swim-lane");
  newLane.id = `lane-${Date.now()}`;
  newLane.innerHTML = `
    <h3>New Lane</h3>
    <ul class="task-list"></ul>
    <input type="text" class="task-input" placeholder="Add a task..." />
    <button class="add-task-btn">Add Task</button>
  `;

  document.getElementById("kanban-board").appendChild(newLane);

  // Add task creation functionality to the new lane
  const taskInput = newLane.querySelector(".task-input");
  const addTaskButton = newLane.querySelector(".add-task-btn");

  addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      handleNewTask(taskText, newLane.id); // Create task in the new lane
      taskInput.value = ""; // Clear input
    }
  });

  // Allow the new lane to handle drag and drop
  newLane.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(newLane, e.clientY);
    const curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      newLane.appendChild(curTask);
    } else {
      newLane.insertBefore(curTask, bottomTask);
    }
    saveTasks(); // Save tasks after drop
  });

  // Save tasks whenever a change occurs
  newLane.addEventListener("drop", (e) => {
    e.preventDefault();
    saveTasks(); // Save the updated state
  });
});

// Function to save tasks state to localStorage (or any other storage)
const saveTasks = () => {
  const lanes = document.querySelectorAll(".swim-lane");
  const tasksState = {};

  lanes.forEach((lane) => {
    const laneId = lane.id;
    const tasks = Array.from(lane.querySelectorAll(".task")).map((task) => task.textContent);
    tasksState[laneId] = tasks;
  });

  localStorage.setItem("kanbanState", JSON.stringify(tasksState));
};

// Load tasks from localStorage when the page is loaded
window.addEventListener("load", () => {
  const savedState = JSON.parse(localStorage.getItem("kanbanState"));

  if (savedState) {
    Object.keys(savedState).forEach((laneId) => {
      const lane = document.getElementById(laneId);
      const tasks = savedState[laneId];

      tasks.forEach((taskText) => {
        handleNewTask(taskText, laneId);
      });
    });
  }
});
