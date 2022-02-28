import moment from "moment";

export function returnDateDiff(
  past: string | undefined,
  now: string | undefined
): number | undefined {
  if (past === undefined || now === undefined) {
    return 0;
  }

  let time_one = moment(past);
  let time_two = moment(now);
  let duration = moment.duration(time_two.diff(time_one));
  return parseInt(duration.asDays().toFixed());
}

export interface Task {
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
  "Time To Resolve Task": number | undefined;
  "Time To Change State": number | undefined;
  "Time To Autorize": number | undefined;
  "Time Total": number | undefined;
  "Sprint Start Date": string;
  Tags: string;
}

class NewTasks {
  formatJson(json: any) {
    let board: Task[];

    board = json.map((value: any) => {
      let campos = value["fields"];

      let timeToResolveTask: number | undefined;
      let timeToChangeState: number | undefined;
      let timeToAutorized: number | undefined;
      let timeTotal: number | undefined;

      let createdDate = campos["System.CreatedDate"].split("T", 1).toString();
      let activatedDate = campos["Microsoft.VSTS.Common.ActivatedDate"]
        ?.split("T", 1)
        .toString();
      let stateChangeDate = campos["Microsoft.VSTS.Common.StateChangeDate"]
        .split("T", 1)
        .toString();
      let changedDate = campos["System.ChangedDate"].split("T", 1).toString();

      let area = campos["System.AreaPath"].split("\\").slice(-1)[0];
      let iteration = campos["System.IterationPath"].split("\\").slice(-1)[0];
      let sprint = iteration.split(" ").slice(0)[0].toString();

      if (
        campos["System.State"] !== "Approved" &&
        campos["System.State"] !== "Releasing" &&
        campos["System.State"] !== "Closed"
      ) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();

        timeTotal = returnDateDiff(activatedDate, `${yyyy}-${mm}-${dd}`);
      } else {
        timeTotal = returnDateDiff(activatedDate, stateChangeDate);
      }

      let activateBy =
        campos["Microsoft.VSTS.Common.ActivatedBy"] !== undefined
          ? campos["Microsoft.VSTS.Common.ActivatedBy"]["displayName"]
          : "New";
      let assignedTo =
        campos["System.AssignedTo"] !== undefined
          ? campos["System.AssignedTo"]["displayName"]
          : "New";

      let task: Task = {
        ID: value.id.toString(),
        Title: campos["System.Title"],
        "Work Item Type": campos["System.WorkItemType"],
        State: campos["System.State"],
        "State Change Date": stateChangeDate,
        Area: area,
        "Iteration Path": iteration,
        "Activated By": activateBy,
        "Activated Date": activatedDate,
        "Assigned To": assignedTo,
        "Changed By": campos["System.ChangedBy"]["displayName"],
        "Changed Date": changedDate,
        "Completed Work": value["Completed Work"]?.toString(),
        "Created By": campos["System.CreatedBy"]["displayName"],
        "Created Date": createdDate,
        Description: campos["System.Description"],
        Reason: campos["System.Reason"],
        "Story Points": campos["Microsoft.VSTS.Scheduling.StoryPoints"],
        "Time To Resolve Task": timeToResolveTask,
        "Time To Change State": timeToChangeState,
        "Time To Autorize": timeToAutorized,
        "Time Total": timeTotal,
        "Sprint Start Date": sprint,
        Tags: campos["System.Tags"],
      };

      return task;
    });

    return board;
  }
}

export default NewTasks;
