// Create tasks

export default class Task {
  constructor(name, project, dueDate, description, priority) {
    this.name = name;
    this.project = project || null;
    this.dueDate = dueDate || "No Date";
    this.description = description || null;
    this.priority = priority || null;
    this.isDone = false;
    this.id = generateId();
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  setDate(dueDate) {
    this.dueDate = dueDate;
  }

  getDate() {
    return this.dueDate;
  }
}

function generateId() {
  return Math.random().toString(16).slice(2);
}
