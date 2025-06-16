import { useEffect, useState } from "react";
import { returnDateDiff } from "../../model/tasks";
import { Box, Divider, Stack } from "@chakra-ui/react";
import { GenericTable } from "../GenericTable";
import Report from "../../data/report";
import { setupAPIMetrics } from "../../services/api";
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


interface StateTable {
  task: Task;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({organization, project_id ,token} );

export function StateTable({ task }: StateTable) {
  const [stateTime, setStateTime] = useState<StateTimeInterface>();

  const report = new Report();

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
        if (state !== undefined) {
          stateElement.push(state);
          timeElement.push(time);
        }
      }

      let removeClosedTime = Array.from(timeElement);

      stateElement.forEach((element, index) => {
        if(element === "Closed"){
          removeClosedTime.splice(index, 1)
        }
      });

      stateElement.push("Lead Time")
      const leadTime = removeClosedTime.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      );
      
      timeElement.push(leadTime)
      setStateTime({ stateElement, timeElement });
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
    <Box mb="3" maxWidth={2020}>
        <GenericTable
          title=""
          labels={stateTime?.stateElement}
          data={stateTime?.timeElement}
        />
         <Divider mt="5" orientation='horizontal' />
    </Box>
  );
}
