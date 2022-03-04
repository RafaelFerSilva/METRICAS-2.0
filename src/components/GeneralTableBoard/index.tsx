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
  "Time To Resolve Task": number | undefined;
  "Time To Change State": number | undefined;
  "Time To Autorize": number | undefined;
  "Time Total": number | undefined;
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
          title="User Story por State"
          labels={report.returnStates(
            report.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
          data={report.returnArraySprintTasksStateCount(
            report.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
        />

        <GenericTable
          title="Pontos Entregues x Pontos a Entregar"
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
          title="Bugs por State"
          labels={report.returnStates(
            report.returnAllTasksByWorkItemType(tasks, "Bug")
          )}
          data={report.returnArraySprintTasksStateCount(
            report.returnAllTasksByWorkItemType(tasks, "Bug")
          )}
        />
        <GenericTable
          title="User Story X Bugs X Melhorias"
          labels={["User Story", "Bug", "Melhorias"]}
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
