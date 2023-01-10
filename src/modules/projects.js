// Manage tasks

import { isToday, isTomorrow, isThisWeek, subDays } from "date-fns";

export default class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  getTasks() {
    return this.tasks;
  }

  addTask(newTask) {
    this.tasks.push(newTask);
  }

  getTask(id) {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDate());
      return isToday(taskDate);
    });
  }

  getTasksTomorrow() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDate());
      return isTomorrow(taskDate);
    });
  }

  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDate());
      return isThisWeek(subDays(taskDate, 1));
    });
  }
}
