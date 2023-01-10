import { getTodoList } from "..";
import Task from "./task";
import format from "date-fns/format";

let mytodolist = getTodoList();

export default class UI {
  static onLoad() {
    UI.openList("Inbox", document.getElementById("btn-inbox-list"));
    UI.loadLists();
    UI.initListBtns();
  }

  // LIST EVENTS

  static initListBtns() {
    const toggleNavBtn = document.getElementById("btn-toggle-nav");
    const inboxBtn = document.getElementById("btn-inbox-list");
    const todayBtn = document.getElementById("btn-today-list");
    const tomorrowBtn = document.getElementById("btn-tomorrow-list");
    const thisWeekBtn = document.getElementById("btn-thisweek-list");

    const userListBtns = document.querySelectorAll(".btn-user-list");

    toggleNavBtn.addEventListener("click", UI.openNav);
    inboxBtn.addEventListener("click", UI.openInbox);
    todayBtn.addEventListener("click", UI.openToday);
    tomorrowBtn.addEventListener("click", UI.openTomorrow);
    thisWeekBtn.addEventListener("click", UI.openThisWeek);

    userListBtns.forEach((btn) => {
      btn.addEventListener("click", UI.openUserList);
    });
  }

  static openNav() {
    const nav = document.querySelector(".nav");
    nav.classList.toggle("active");
  }

  static openInbox() {
    UI.openList("Inbox", this);
  }

  static openToday() {
    mytodolist.updateTodayList();
    UI.openList("Today", this);
  }

  static openTomorrow() {
    mytodolist.updateTomorrowList();
    UI.openList("Tomorrow", this);
  }

  static openThisWeek() {
    mytodolist.updateThisWeekList();
    UI.openList("This Week", this);
  }

  static openUserList() {
    const list = this.children[0].children[1].textContent;
    UI.openList(list, this);
  }

  static openList(listName, listBtn) {
    const defaultListBtns = document.querySelectorAll(".btn-default-list");
    const userListBtns = document.querySelectorAll(".btn-user-list");

    const listBtns = [...defaultListBtns, ...userListBtns];

    listBtns.forEach((btn) => btn.classList.remove("active"));
    listBtn.classList.add("active");

    UI.loadListContent(listName);
  }

  //  TASK EVENTS

  static initTaskBtns() {
    const taskBtns = document.querySelectorAll(".btn-task");
    const taskNameInputs = document.querySelectorAll(".input-task-name");
    const dueDateInputs = document.querySelectorAll(".input-due-date");

    taskBtns.forEach((btn) => btn.addEventListener("click", UI.handleTaskBtn));

    taskNameInputs.forEach((input) =>
      input.addEventListener("keypress", UI.renameTask)
    );

    dueDateInputs.forEach((input) =>
      input.addEventListener("input", UI.setDueDate)
    );
  }

  static handleTaskBtn(e) {
    if (e.target.classList.contains("fa-square")) {
      UI.completeTask(this);
    }

    if (e.target.classList.contains("fa-square-xmark")) {
      UI.deleteTask(this);
    }

    if (e.target.classList.contains("due-date")) {
      console.log("OPEN DUE DATE INPUT!");
      UI.openDueDateInput(this);
    }

    if (e.target.classList.contains("task-content")) {
      UI.openRenameInput(this);
    }
  }

  static deleteTask(taskBtn) {
    const listName = document.getElementById("list-name").textContent;
    const taskId = taskBtn.children[0].children[1].dataset.itemId;

    mytodolist.getList(listName).deleteTask(taskId);

    UI.clearListItems();
    UI.loadTasks(listName);
  }

  static completeTask(taskBtn) {
    const listName = document.getElementById("list-name").textContent;
    const taskId = taskBtn.children[0].children[1].dataset.itemId;

    mytodolist.getList(listName).deleteTask(taskId);

    UI.clearListItems();
    UI.loadTasks(listName);
  }

  static renameTask(e) {
    if (e.key !== "Enter") return;

    const listName = document.getElementById("list-name").textContent;
    const taskId = this.previousElementSibling.dataset.itemId;
    const task = mytodolist.getList(listName).getTask(taskId);
    const newTaskName = this.value;

    if (newTaskName === "") {
      alert("Task name can't be empty");
      return;
    }

    task.name = newTaskName;

    UI.clearListItems();
    UI.loadTasks(listName);
    UI.closeRenameInput(this.parentElement.parentElement);
  }

  static openRenameInput(taskBtn) {
    const taskNameP = taskBtn.children[0].children[1];
    const taskNameInput = taskBtn.children[0].children[2];

    taskNameP.classList.toggle("active");
    taskNameInput.classList.toggle("active");
  }

  static closeRenameInput(taskBtn) {
    const taskNameP = taskBtn.children[0].children[1];
    const taskNameInput = taskBtn.children[0].children[2];

    taskNameP.classList.toggle("active");
    taskNameInput.classList.toggle("active");
    taskNameInput.value = "";
  }

  static setDueDate(e) {
    const listName = document.getElementById("list-name").textContent;
    const taskBtn = this.parentElement.parentElement;
    const taskId = this.parentElement.parentElement.dataset.itemId;
    const taskBtnP = this.previousElementSibling;
    const dueDate = format(new Date(this.value), "MM/dd/yyyy");
    taskBtnP.textContent = dueDate;

    mytodolist.getList(listName).getTask(taskId).setDate(dueDate);
    mytodolist.getList(listName).getTasksTomorrow();

    UI.closeDueDateInput(taskBtn);
  }

  static openDueDateInput(taskBtn) {
    const dueDateP = taskBtn.children[1].children[0];
    const dueDateInput = taskBtn.children[1].children[1];

    dueDateP.classList.toggle("active");
    dueDateInput.classList.toggle("active");
  }

  static closeDueDateInput(taskBtn) {
    const dueDateP = taskBtn.children[1].children[0];
    const dueDateInput = taskBtn.children[1].children[1];

    dueDateP.classList.toggle("active");
    dueDateInput.classList.toggle("active");
    dueDateInput.value = "";
  }

  // LOAD CONTENT

  static loadLists() {
    mytodolist.getLists().forEach((list) => {
      if (
        list.name !== "Inbox" &&
        list.name !== "Today" &&
        list.name !== "Tomorrow" &&
        list.name !== "This Week"
      ) {
        UI.createList(list.name);
      }
    });

    UI.initAddListBtns();
  }

  static loadListContent(listName) {
    const listView = document.getElementById("list-view");

    listView.innerHTML = `
    <h1 id="list-name">${listName}</h1>
    <ul class="list-items" id="list-items"></ul>
    `;

    if (
      listName !== "Today" &&
      listName !== "Tomorrow" &&
      listName !== "This Week"
    ) {
      UI.loadAddTaskEditor();
    }

    UI.loadTasks(listName);
  }

  static loadAddTaskEditor() {
    const listView = document.getElementById("list-view");

    listView.innerHTML += `
    <button type="button" class="btn-add-task active" id="btn-add-task">
      <i class="fa-solid fa-plus"></i>
      Add Task
    </button>

  <div class="add-task-editor" id="add-task-editor">
  <div class="form">
    <div class="add-task-editor-body">
      <div class="add-task-editor-input-fields">
        <input
          type="text"
          id="add-task-name-input"
          placeholder="Task name"
        />
        <input
          type="text"
          id="add-task-description-input"
          placeholder="Description"
        />
      </div>
      <div class="add-task-editor-extra-fields">
        <button id="btn-due-date-editor">
          <i class="fa-regular fa-calendar"></i>
        </button>
        <button id="btn-priority-editor">
          <i class="fa-regular fa-flag"></i>
        </button>
      </div>
    </div>
    <div class="add-task-editor-btns">
      <button
        type="button"
        class="btn-cancel-task-editor"
        id="btn-cancel-task-editor"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn-add-task-editor"
        id="btn-add-task-editor"
      >
        Add
      </button>
    </div>
  </div>
</div> 
`;
  }

  static loadTasks(listName) {
    if (!listName) {
      UI.openList("Inbox", document.getElementById("btn-inbox-list"));
      UI.initAddTaskBtns();
    } else
      mytodolist
        .getList(listName)
        .getTasks()
        .forEach((task) =>
          UI.createTask(task.name, task.dueDate, task.getId())
        );

    if (
      listName !== "Today" &&
      listName !== "Tomorrow" &&
      listName !== "This Week"
    )
      UI.initAddTaskBtns();
  }

  // CREATE CONTENT

  static createTask(name, dueDate, id) {
    const listItems = document.getElementById("list-items");

    listItems.innerHTML += `
    <li>
      <button type="button" class="btn-task" data-item-id="${id}">
        <div class="task-container-left">
          <i class="fa-regular fa-square"></i>
          <p class="task-content active" data-item-id="${id}">${name}</p>
          <input type="text" class="input-task-name" />
        </div>
        <div class="task-container-right">
          <p class="due-date active">${dueDate}</p>
          <input type="date" class="input-due-date" />
          <i class="fa-solid fa-square-xmark"></i>
        </div>
      </button>
    </li>
    `;

    UI.initTaskBtns();
  }

  static createList(name) {
    const userList = document.getElementById("user-lists");

    userList.innerHTML += `
    <button class="btn-user-list" id="btn-${name}">
      <div class="list-container-left">
        <i class="fa-solid fa-list-ul"></i>
        <p>${name}</p>
      </div>
      <div class="list-container-right">
        <i class="fa-solid fa-xmark"></i>
      </div>
      </button>
    `;

    UI.initListBtns();
    UI.initAddListBtns();
  }

  // ADD LIST EVENTS

  static initAddListBtns() {
    const addListBtn = document.getElementById("btn-add-list");
    const addListModalBtn = document.getElementById("btn-add-list-modal");
    const cancelListModalBtn = document.getElementById("btn-cancel-list-modal");
    const addListModalInput = document.getElementById("add-list-modal-input");

    addListBtn.addEventListener("click", UI.openAddListModal);
    addListModalBtn.addEventListener("click", UI.addList);
    cancelListModalBtn.addEventListener("click", UI.closeAddListModal);
    addListModalInput.addEventListener("keydown", UI.handleAddListKeyInput);

    const userListBtns = document.querySelectorAll(".btn-user-list");
    userListBtns.forEach((btn) =>
      btn.addEventListener("click", UI.handleListBtns)
    );

    UI.initAddListModal();
  }

  static handleListBtns(e) {
    const listName = e.target.textContent;
    if (e.target.classList.contains("fa-xmark")) {
      UI.deleteList(this);
    }

    UI.openList(listName, this);
  }

  static addList() {
    const addListModalInput = document.getElementById("add-list-modal-input");
    const projectName = addListModalInput.value;

    if (projectName === "") {
      alert("Project name can't be empty.");
      return;
    }

    if (mytodolist.getList(projectName)) {
      addListModalInput.value = "";
      alert("Duplicated project name");
      return;
    }

    mytodolist.addList(projectName);
    UI.createList(projectName);
    UI.closeAddListModal();
  }

  static deleteList(listBtn) {
    const listName = listBtn.children[0].children[1].textContent;
    console.log(`DELETING THE ${listName} LIST !!!`);

    mytodolist.deleteList(listName);
    UI.clearLists();
    UI.loadLists();
  }

  static clearLists() {
    const userList = document.getElementById("user-lists");

    userList.textContent = "";

    UI.initListBtns();
  }

  static clearListItems() {
    const listItems = document.getElementById("list-items");
    listItems.textContent = "";
  }

  static clearListView() {
    const listView = document.getElementById("list-view");
    listView.textContent = "";
  }

  static initAddListModal() {
    const addListModalBtn = document.getElementById("btn-add-list-modal");
    const addListModalInput = document.getElementById("add-list-modal-input");

    addListModalInput.addEventListener("keyup", (e) => {
      const value = e.currentTarget.value;
      addListModalBtn.disabled = true;
      if (value != "") {
        addListModalBtn.disabled = false;
        addListModalBtn.classList.remove("disabled");
      }
    });
  }

  static openAddListModal() {
    const addListBtn = document.getElementById("btn-add-list");
    const addListModal = document.getElementById("add-list-modal");

    addListBtn.classList.add("active");
    addListModal.classList.add("active");
  }

  static closeAddListModal() {
    const addListBtn = document.getElementById("btn-add-list");
    const addListModal = document.getElementById("add-list-modal");
    const addListModalInput = document.getElementById("add-list-modal-input");

    addListBtn.classList.remove("active");
    addListModal.classList.remove("active");
    addListModalInput.value = "";
  }

  static handleAddListKeyInput(e) {
    if (e.key === "Enter") UI.addList();
  }

  // ADD TASK EVENTS

  static initAddTaskBtns() {
    const addTaskBtn = document.getElementById("btn-add-task");
    const addTaskEditorBtn = document.getElementById("btn-add-task-editor");
    const cancelTaskEditorBtn = document.getElementById(
      "btn-cancel-task-editor"
    );
    addTaskBtn.addEventListener("click", UI.openAddTaskEditor);
    addTaskEditorBtn.addEventListener("click", UI.addTask);
    cancelTaskEditorBtn.addEventListener("click", UI.closeAddTaskEditor);
  }

  static openAddTaskEditor() {
    const addTaskEditor = document.getElementById("add-task-editor");
    const addTaskBtn = document.getElementById("btn-add-task");

    addTaskEditor.classList.add("active");
    addTaskBtn.classList.remove("active");
  }
  static closeAddTaskEditor() {
    const addTaskEditor = document.getElementById("add-task-editor");
    const addTaskBtn = document.getElementById("btn-add-task");
    const addTaskNameInput = document.getElementById("add-task-name-input");
    const addTaskDescInput = document.getElementById(
      "add-task-description-input"
    );

    addTaskEditor.classList.remove("active");
    addTaskBtn.classList.add("active");

    addTaskNameInput.value = "";
    addTaskDescInput.value = "";
  }

  static addTask() {
    const listName = document.getElementById("list-name").textContent;
    const addTaskNameInput = document.getElementById("add-task-name-input");
    const addTaskDescInput = document.getElementById(
      "add-task-description-input"
    );
    const taskName = addTaskNameInput.value;
    const taskDesc = addTaskDescInput.value;

    if (taskName === "") {
      alert("Task needs a name");
      return;
    }

    mytodolist.getList(listName).addTask(new Task(taskName, listName));

    UI.createTask(taskName);
    UI.closeAddTaskEditor();
    UI.loadListContent(listName);
    console.log(mytodolist.getList(listName).getTasks());
  }
}
