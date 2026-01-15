import moment from "moment";
import { AxiosInstance } from "axios"
import { tokenService } from "../services/auth/tokenService";
import { setupAPIMetrics } from "../services/api";
import { Task } from "../core/shared/types/Task";

const organization = tokenService.getOrganization()

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

class NewTasks {
  formatJson(json: any) {
    let board: Task[];

    board = json.map((value: any) => {
      let campos = value["fields"];

      let cycleTime: number | undefined;

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
        campos["System.State"] !== "Resolved" &&
        campos["System.State"] !== "Approved" &&
        campos["System.State"] !== "Releasing" &&
        campos["System.State"] !== "Removed" &&
        campos["System.State"] !== "Closed"
      ) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();

        cycleTime = returnDateDiff(activatedDate, `${yyyy}-${mm}-${dd}`);
      } else {
        cycleTime = returnDateDiff(activatedDate, stateChangeDate);
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
        "Cycle Time": cycleTime,
        "Sprint Start Date": sprint,
        Tags: campos["System.Tags"],
        Activity: campos["Microsoft.VSTS.Common.Activity"],
        url: `https://dev.azure.com/${organization}/${campos["System.TeamProject"]}/_workitems/edit/${value["id"]}`,
        Priority: campos["Microsoft.VSTS.Common.Priority"],
        Severity: campos["Microsoft.VSTS.Common.Severity"]
      };

      return task;
    });

    return board;
  }
}

export default NewTasks;
