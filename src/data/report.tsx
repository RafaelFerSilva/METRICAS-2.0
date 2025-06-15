import { Task } from "../types/Task";


export interface ChartData {
  labels: string;
  data: number | undefined;
}

class Report {
  returnLifeCicleByWorkItemType(tasks: Task[], workItemType: string) {
    let cicle: ChartData[];

    let sprintTask = this.returnAllTasksByWorkItemType(tasks, workItemType);
    cicle = sprintTask.map((item) => {
      return {
        labels: `${item.ID} - ${item.Title}`,
        data: item["Cycle Time"],
      };
    });

    return cicle;
  }

  returnCicleTimeByWorkItemType(tasks: Task[], workItemType: string) {
    let cicle: any;

    let sprintTask = this.returnAllTasksByWorkItemType(tasks, workItemType);
    cicle = sprintTask.map((item) => {
      return item["Cycle Time"]
    });
    return cicle;
  }

  returnTaskTitle(tasks: Task[]) {

    let task_name = tasks.map((item) => {
      let title = `${item.ID} - ${item.Title}`

      if (title.length < 40) {
        return title
      }
      return `${title.slice(0, 40)}...`
    });

    return task_name;
  }

  returnTaskID(tasks: Task[]) {

    let id = tasks.map((item) => {
      return item.ID
    });

    return id;
  }

  returnAllTasksByWorkItemType(tasks: Task[], workItemType: string) {
    let task = tasks.filter(function (item) {
      return (
        item["Work Item Type"] === workItemType
      );
    });

    return task;
  }

  returnAllTasksByWorkItemTag(tasks: Task[], tag: string) {
    let azureTags = tasks.filter((item) => {
      return typeof item["Tags"] !== "undefined";
    });

    let splitTag = azureTags.filter((item) => {
      let element = item["Tags"].split("; ");
      return element.includes(tag);
    });

    return splitTag;
  }

  returnTagsList(tags: string[], tasks: Task[]) {
    let itens: any[] = []
    tags.map((tag) => {
      let usList = this.returnAllTasksByWorkItemTag(tasks, tag).map((item) => {
        return item
      })

      if (usList.length > 0) {
        itens.push(usList)
      }
    })

    if (itens[0] !== undefined) {
      return itens[0]
    }

    return []
  }

  returnLifeCicle(tasks: Task[], sprint: any) {
    let cicle: ChartData[];
    let sprintTask = this.returnAllTasksBySprint(tasks, sprint);
    cicle = sprintTask.map((item) => {
      return {
        labels: item.Title,
        data: item["Cycle Time"],
      };
    });

    return cicle;
  }

  returnStates(tasks: Task[]) {
    let state: string[] = tasks.map((element) => {
      return element.State;
    });

    const novoArray = Array.from(new Set(state));
    return novoArray;
  }

  colorSchema() {
    
  }

  
returnStateDate(item: Task[]) {
  const statusColors = {
    New: 'purple',
    UAT: 'orange',
    RC: 'green',
    QA: 'black',
    Releasing: 'brown',
    Active: 'blue',
    Resolved: 'yellow',
    Closed: 'red'
  };

  const userStoryStatesData = this.returnStates(item).map((state, index) => ({
    label: state,
    value: this.returnArraySprintTasksStateCount(item)[index] || 0,
    color: statusColors[state] || 'gray'
  }));

  return userStoryStatesData;
}

  returnArraySprintTasksStateCount(tasks: Task[]) {
    let state = this.returnStates(tasks);

    let count = state.map((element: any) => {
      let length = tasks.filter(function (item) {
        return item.State === element;
      }).length;

      return length;
    });

    return count;
  }

  returnTasksByState(tasks: Task[], state: string) {
    let array = tasks.filter(function (item) {
      return item.State === state;
    });

    return array;
  }

  returnReason(tasks: Task[]) {
    let reason: string[] = tasks.map((element) => {
      return element.Reason;
    });

    const novoArray = Array.from(new Set(reason));
    return novoArray;
  }

  returnArraySprintTasksReasonCount(tasks: Task[]) {
    let reason = this.returnReason(tasks);

    let count = reason.map((element: any) => {
      let length = tasks.filter(function (item) {
        return item.Reason === element;
      }).length;

      return length;
    });

    return count;
  }

  returnTasksByReason(tasks: Task[], reason: string) {
    let array = tasks.filter(function (item) {
      return item.Reason === reason;
    });

    return array;
  }

  returnTasksCompleted(tasks: Task[]) {
    let array = tasks.filter(function (item) {
      return (
        item.State === "Resolved" ||
        item.State === "Approved" ||
        item.State === "Closed" ||
        item.State === "Releasing" ||
        item.State === "In Production"
      );
    });


    return array;
  }

  returnTasksNotCompleted(tasks: Task[]) {
    let array = tasks.filter(function (item) {
      return (
        item.State !== "Resolved" &&
        item.State !== "Approved" &&
        item.State !== "Closed" &&
        item.State !== "Releasing" &&
        item.State !== "In Production"
      );
    });

    return array;
  }

  returnAllTasksBySprint(tasks: Task[], sprint: string | undefined) {
    let task = tasks.filter(function (item) {
      return item["Iteration Path"] === sprint;
    });
    return task;
  }

  returnTasksStoryPoint(tasks: Task[]) {
    let task_point = tasks.map((item) => item["Story Points"]);
    return task_point;
  }

  returnTasksPoints(tasks: Task[]) {
    let total = 0;
    tasks.map((element) => {
      if (element["Story Points"] !== undefined) {
        total += +element["Story Points"];
      }
      return total;
    });

    return total;
  }

  returnBugs(tasks: Task[]) {
    let bugs = this.returnAllTasksByWorkItemType(tasks, "Bug")

    return bugs;
  }

  returnUsersStories(tasks: Task[]) {
    return this.returnAllTasksByWorkItemType(tasks, "User Story");
  }

  returnTaskItens(tasks: Task[]) {
    return this.returnAllTasksByWorkItemType(tasks, "Task");
  }

  returnDefects(tasks: Task[]) {
    return this.returnAllTasksByWorkItemType(tasks, "Defect");
  }

  returnProblems(tasks: Task[]) {
    let problems_orbia = this.returnAllTasksByWorkItemType(tasks, "Orbia Problem");
    let problems = this.returnAllTasksByWorkItemType(tasks, "Problem");
    return problems.concat(problems_orbia);
  }

  returnCompletedUsersStoriesLenght(tasks: Task[]) {
    const userStories = this.returnUsersStories(tasks)
    return userStories.filter(us => us.State === "Closed").length;
  }

  returnCompletedDefectsLenght(tasks: Task[]) {
    const defects = this.returnDefects(tasks)
    return defects.filter(def => def.State === "Closed").length;
  }

  returnCompletedBugs(tasks: Task[]) {
    const bugs = this.returnBugs(tasks);
    return bugs.filter(bug => bug.State === "Closed").length;
  }

  returnCompletedProblemsLenght(tasks: Task[]) {
    const problems = this.returnProblems(tasks);
    return problems.filter(problem => problem.State === "Closed").length;
  }

  returncompletedTasksItems(tasks: Task[]) {
    const taskItems = this.returnTaskItens(tasks);
    return taskItems.filter(task =>
      task.State === 'Closed'
    ).length;
  }

  returntotalStoryPoints(tasks: Task[]) {
    const userStories = this.returnUsersStories(tasks)
    return userStories.reduce((sum, story) => {
      const points = typeof story["Story Points"] === 'number' ? story["Story Points"] : 0;
      return sum + points;
    }, 0);
  }

  returncompletedStoryPoints(tasks: Task[]) {
    const userStories = this.returnUsersStories(tasks)
    return userStories
      .filter(story => story.State === "Closed")
      .reduce((sum, story) => {
        const points = typeof story["Story Points"] === 'number' ? story["Story Points"] : 0;
        return sum + points;
      }, 0);
  }

  getKeys<T>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];   
   }

  returnTasksTableData(data: Task[], header: string[]) {
    const tableData = data.map(item => {
        return header.reduce((acc, key) => {
            acc[key] = item[key];
            return acc;
        }, {});
    });

    return tableData
  }

  returnSprintData(tasks: Task[]) {
    const userStories = this.returnUsersStories(tasks);
    const bugs = this.returnBugs(tasks);
    const taskItems = this.returnTaskItens(tasks);
    const defects = this.returnDefects(tasks);
    const problems = this.returnProblems(tasks);
    const completedTasks = this.returnTasksCompleted(tasks);

    const userStoryStatesData = this.returnStateDate(userStories)
    const bugStatesData = this.returnStateDate(bugs)
    const defectStatesData = this.returnStateDate(defects)
    const problemsStateData = this.returnStateDate(problems)
    const taskStatesData = this.returnStateDate(taskItems)

    const completedUserStories = this.returnCompletedUsersStoriesLenght(tasks)
    const completedDefects = this.returnCompletedDefectsLenght(tasks);
    const completedBugs = this.returnCompletedBugs(tasks);
    const completedProblems = this.returnCompletedProblemsLenght(tasks);
    const completedTasksItems = this.returncompletedTasksItems(tasks);
    const completedStoryPoints = this.returncompletedStoryPoints(tasks)
    const totalStoryPoints = this.returntotalStoryPoints(tasks);

    const userStoriesRate = userStories.length > 0 ? (userStories.filter(us => us.State === "Closed").length / userStories.length) * 100 : 0;
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    const storyPointsRate = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;
    const usRate = userStories.length > 0 ? (userStories.filter(us => us.State === "Closed").length / userStories.length) * 100 : 0;
    const defectsRate = defects.length > 0 ? (defects.filter(defect => defect.State === "Closed").length / defects.length) * 100 : 0;
    const bugsRate = bugs.length > 0 ? (bugs.filter(bug => bug.State === "Closed").length / bugs.length) * 100 : 0;
    const problemsRate = problems.length > 0 ? (problems.filter(problem => problem.State === "Closed").length / problems.length) * 100 : 0;
    const tasksItensRate = taskItems.length > 0 ? (taskItems.filter(task => task.State === "Closed").length / taskItems.length) * 100 : 0;

    return {
      userStories: userStories,
      bugs: bugs,
      taskItems: taskItems,
      defects: defects,
      problems: problems,
      completedTasks: completedTasks,
      userStoryStatesData: userStoryStatesData,
      bugStatesData: bugStatesData,
      defectStatesData: defectStatesData,
      problemsStateData: problemsStateData,
      taskStatesData: taskStatesData,
      completedUserStories: completedUserStories,
      completedDefects: completedDefects,
      completedBugs: completedBugs,
      completedProblems: completedProblems,
      completedTasksItems: completedTasksItems,
      completedStoryPoints: completedStoryPoints,
      totalStoryPoints: totalStoryPoints,
      userStoriesRate: userStoriesRate,
      completionRate: completionRate,
      storyPointsRate: storyPointsRate,
      usRate: usRate,
      defectsRate: defectsRate,
      bugsRate: bugsRate,
      problemsRate: problemsRate,
      tasksItensRate: tasksItensRate
    };
  }
}

export default Report;
