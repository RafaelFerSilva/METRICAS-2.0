import { useEffect, useState } from "react";
import { returnDateDiff } from "../../model/tasks";
import { setupAPIMetrics } from "../../services/api";
import { Box, Divider } from "@chakra-ui/react";
import { GenericTable } from "../GenericTable";
import { tokenService } from "../../services/auth/tokenService";

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

interface WorkItemState {
  workItemId: string;
  title: string;
  revisedBy: string;
  reason: string;
  state: string;
  stateChangeDate: string;
}

interface ColumTimeInterface {
  stateElement: string[];
  timeElement: number[];
}

interface ColumItemGraphItemGraphProps {
  task: Task;
}

interface RevisionsItens {
  id: string;
  title: string;
  column: string;
  data: string;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({organization, project_id ,token} );

export function ColumItemTable({ task }: ColumItemGraphItemGraphProps) {
  const [stateTime, setStateTime] = useState<ColumTimeInterface>();

  useEffect(() => {
    let itens: RevisionsItens[] = [];

    function calcularTime(item: RevisionsItens[]) {
      let ind = 0;
      let stateElement: string[] = [];
      let timeElement: any[] = [];

      while (ind < item.length) {
        let state: string;
        let time: number | undefined;

        if (item[ind + 1] !== undefined) {
          if (item[ind].column !== item[ind + 1].column) {
            state = item[ind].column;
            time = returnDateDiff(item[ind].data, item[ind + 1].data);
          }
        } else {
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, "0");
          let mm = String(today.getMonth() + 1).padStart(2, "0");
          let yyyy = today.getFullYear();

          state = item[ind].column;
          time = returnDateDiff(item[ind].data, `${yyyy}-${mm}-${dd}`);
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

    axiosInstance.get(`wit/workItems/${task.ID}/revisions`).then((response) => {
      if (response.status === 200) {
        response.data.value.map((element: any) => {
          let item: RevisionsItens;

          item = {
            id: element.id,
            title: element.fields["System.Title"],
            column: element.fields["System.BoardColumn"],
            data: element.fields["Microsoft.VSTS.Common.StateChangeDate"]
              .split("T", 1)
              .toString(),
          };

          itens.push(item);

          return itens;
        });
      } 
      calcularTime(itens);
    })
  }, [task.ID]);

  return (
    <Box mb="3" maxWidth={2020}>
      <GenericTable
        title=""
        labels={stateTime?.stateElement}
        data={stateTime?.timeElement}
      />
      <Divider mt="5" orientation="horizontal" />
    </Box>
  );
}
