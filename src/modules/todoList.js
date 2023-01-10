/*
Manage and store named lists (projects)
Default lists: Inbox, Today, Tomorrow, This week
*/

import Project from "./projects";
import Task from "./task";
import compareAsc from "date-fns/compareAsc";

export default class TodoList {
  constructor(array) {
    this.list = array || [];
    this.list.push(new Project("Inbox"));
    this.list.push(new Project("Today"));
    this.list.push(new Project("Tomorrow"));
    this.list.push(new Project("This Week"));
  }

  setLists(lists) {
    this.list = lists;
  }

  getLists() {
    return this.list;
  }

  getList(projectName) {
    return this.list.find((list) => list.name === projectName);
  }

  addList(projectName) {
    if (this.list.find((list) => list.name === projectName)) return;
    else this.list.push(new Project(projectName));
  }

  deleteList(projectName) {
    const listToDelete = this.list.find((list) => list.name === projectName);
    alert(`Are you sure you want to delete "${listToDelete.name}"?`);

    this.list.splice(this.list.indexOf(listToDelete), 1);
  }

  updateTodayList() {
    this.getList("Today").tasks = [];

    this.list.forEach((list) => {
      if (
        list.getName() === "Today" ||
        list.getName() === "Tomorrow" ||
        list.getName() === "This Week"
      )
        return;

      const todayTasks = list.getTasksToday();

      todayTasks.forEach((task) => {
        this.getList("Today").addTask(
          new Task(task.getName(), list.getName(), task.getDate())
        );
      });
    });
  }

  updateTomorrowList() {
    this.getList("Tomorrow").tasks = [];

    this.list.forEach((list) => {
      if (
        list.getName() === "Today" ||
        list.getName() === "Tomorrow" ||
        list.getName() === "This Week"
      )
        return;

      const tomorrowTasks = list.getTasksTomorrow();

      tomorrowTasks.forEach((task) => {
        this.getList("Tomorrow").addTask(
          new Task(task.getName(), list.getName(), task.getDate())
        );
      });
    });
  }

  updateThisWeekList() {
    this.getList("This Week").tasks = [];

    this.list.forEach((list) => {
      if (
        list.getName() === "Today" ||
        list.getName() === "Tomorrow" ||
        list.getName() === "This Week"
      )
        return;

      const thisWeekTasks = list.getTasksThisWeek();

      thisWeekTasks.forEach((task) => {
        this.getList("This Week").addTask(
          new Task(task.getName(), list.getName(), task.getDate())
        );
      });
    });

    this.getList("This Week").setTasks(
      this.getList("This Week")
        .getTasks()
        .sort((taskA, taskB) => {
          compareAsc(new Date(taskA.getDate()), new Date(taskB.getDate()));
        })
    );
  }
}
