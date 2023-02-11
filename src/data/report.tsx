interface Task {
  ID: string;
  Title: string;
  "Work Item Type": string;
  State: string;
  "State Change Date": string;
  Area: string;
  "Iteration Path": string;
  "Activated By": string;
  "Activated Date": string;
  "Assigned To": string | undefined;
  "Changed By": string;
  "Changed Date": string;
  "Completed Work": string | undefined;
  "Created By": string;
  "Created Date": string;
  Description: string | undefined;
  Reason: string;
  "Story Points": number | undefined | string;
  "Cycle Time": number | undefined;
  "Sprint Start Date": string;
  Tags: string;
  Activity: string;
}

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

      if(title.length < 40){
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
}

export default Report;
