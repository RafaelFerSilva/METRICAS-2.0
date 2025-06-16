import { useEffect, useState } from "react";
import { returnDateDiff } from "../../model/tasks";
import { setupAPIMetrics } from "../../services/api";
import { Box } from "@chakra-ui/react";
import { VerticalBar } from "../Charts/ChartVerticalBar";
import { tokenService } from "../../services/auth/tokenService";
import { Task } from "../../types/Task";

interface WorkItemState {
  workItemId: string;
  title: string;
  revisedBy: string;
  reason: string;
  state: string;
  stateChangeDate: string;
}

interface StateTimeInterface {
  stateElement: string[];
  timeElement: number[];
}

interface StateItemGraphProps {
  task: Task;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({organization, project_id ,token} );

export function StateItemGraph({ task }: StateItemGraphProps) {
  const [stateTime, setStateTime] = useState<StateTimeInterface>();
  let titleList = `${task.ID} - ${task.Title}`;

  useEffect(() => {
    let itens: WorkItemState[] = [];

    function calcularTime(item: WorkItemState[]) {
      let ind = 0;
      let stateElement: string[] = [];
      let timeElement: any[] = [];

      while (ind < item.length) {
        let state: string;
        let time: number | undefined;

        if (item[ind + 1] !== undefined) {
          state = item[ind].state;
          time = returnDateDiff(
            item[ind].stateChangeDate,
            item[ind + 1].stateChangeDate
          );
        } else {
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, "0");
          let mm = String(today.getMonth() + 1).padStart(2, "0");
          let yyyy = today.getFullYear();

          state = item[ind].state;
          time = returnDateDiff(
            item[ind].stateChangeDate,
            `${yyyy}-${mm}-${dd}`
          );
        }
        ind += 1;
        stateElement.push(state);
        timeElement.push(time);
      }

      setStateTime({ stateElement, timeElement });
    }

    axiosInstance
      .get(`wit/workItems/${task.ID}/updates?api-version=7.1`)
      .then((response) => {
        if (response.status === 200) {
          response.data.value.map((element: any) => {
            let Id: string;
            let revisedBy: string;
            let reason: string;
            let state: string;
            let stateChangeDate: string;

            if (typeof element.fields !== "undefined") {
              if (typeof element.fields["System.State"] !== "undefined") {
                Id = element.workItemId;
                revisedBy = element.revisedBy.displayName;
                reason = element.fields["System.Reason"].newValue;
                state = element.fields["System.State"].newValue;
                stateChangeDate = element.fields[
                  "Microsoft.VSTS.Common.StateChangeDate"
                ].newValue
                  .split("T", 1)
                  .toString();

                let item = {
                  workItemId: Id,
                  title: task.Title,
                  revisedBy: revisedBy,
                  reason: reason,
                  state: state,
                  stateChangeDate: stateChangeDate,
                };

                if (typeof item !== "undefined") {
                  itens.push(item);
                }
              }
            }

            calcularTime(itens);
            return itens;
          });
        }
      })
  }, [task.ID, task.Title]);

  return (
    <Box key={task.ID} p={["4", "6"]} bg="Snow" borderRadius={8}  mb="4"  maxWidth={1020}>
      <VerticalBar
        key={task.ID}
        title={titleList}
        labels={stateTime?.stateElement}
        data={stateTime?.timeElement}
        label="Days"
      />
    </Box>
  );
}
