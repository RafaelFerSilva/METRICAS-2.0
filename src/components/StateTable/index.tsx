import { useEffect, useState } from "react";
import { returnDateDiff } from "../../model/tasks";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import { Box, Divider, Stack } from "@chakra-ui/react";
import { GenericTable } from "../GenericTable";
import Report from "../../data/report";
import { setupAPIMetrics } from "../../services/api";

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

interface StateTable {
  task: Task;
}

const axiosInstance = setupAPIMetrics();

export function StateTable({ task }: StateTable) {
  const [stateTime, setStateTime] = useState<StateTimeInterface>();
  // const reducer = (previousValue: number, currentValue: number) =>
  //   previousValue + currentValue;

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
        stateElement.push(state);
        timeElement.push(time);
      }

      setStateTime({ stateElement, timeElement });
    }

    axiosInstance
      .get(`wit/workItems/${task.ID}/updates?api-version=6.0`)
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
      });
  }, [task.ID, task.Title]);

  return (
    <Box mb="3" maxWidth={1020}>
        <GenericTable
          title=""
          labels={stateTime?.stateElement}
          data={stateTime?.timeElement}
        />
         <Divider mt="5" orientation='horizontal' />
    </Box>
  );
}
