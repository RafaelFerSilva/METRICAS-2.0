import Report from "../../data/report";
import { GenericTable } from "../GenericTable";
import { Box, Stack } from "@chakra-ui/react";

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

interface GeneralTableBoardProps {
  tasks: Task[]
}

export function GeneralTableBoard( { tasks }: GeneralTableBoardProps) {
  const report = new Report();

  return (
    <Box>
      <Stack gap="3">
        <GenericTable
          title="User Story for State"
          labels={report.returnStates(
            report.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
          data={report.returnArraySprintTasksStateCount(
            report.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
        />

        <GenericTable
          title="Points delivered x Points to be delivered"
          labels={["Pontos Entregues", "Pontos A Entregar"]}
          data={[
            report.returnTasksPoints(
              report.returnAllTasksByWorkItemType(
                report.returnTasksCompleted(tasks),
                "User Story"
              )
            ),
            report.returnTasksPoints(
              report.returnAllTasksByWorkItemType(
                report.returnTasksNotCompleted(tasks),
                "User Story"
              )
            ),
          ]}
        />

        <GenericTable
          title="Bugs by state"
          labels={report.returnStates(
            report.returnAllTasksByWorkItemType(tasks, "Bug")
          )}
          data={report.returnArraySprintTasksStateCount(
            report.returnAllTasksByWorkItemType(tasks, "Bug")
          )}
        />
        <GenericTable
          title="User Story X Bugs X Improvements"
          labels={["User Story", "Bug", "Improvements"]}
          data={[
            report.returnAllTasksByWorkItemType(tasks, "User Story")
              .length,
            report.returnAllTasksByWorkItemType(tasks, "Bug").length,
            report.returnAllTasksByWorkItemTag(tasks, "Melhoria").length,
          ]}
        />
      </Stack>
    </Box>
  );
}
