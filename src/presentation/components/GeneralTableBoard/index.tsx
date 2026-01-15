import { SprintMetricsService } from "../../../core/domain/services/sprint-metrics.service";
import { GenericTable } from "../GenericTable";
import { Box, Stack } from "@chakra-ui/react";
import { Task } from "../../../core/shared/types/Task";

interface GeneralTableBoardProps {
  tasks: Task[]
}

const metricsService = new SprintMetricsService();

export function GeneralTableBoard({ tasks }: GeneralTableBoardProps) {

  return (
    <Box>
      <Stack gap="3">
        <GenericTable
          title="User Story for State"
          labels={metricsService.returnStates(
            metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
          data={metricsService.returnArraySprintTasksStateCount(
            metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
        />

        <GenericTable
          title="Points delivered x Points to be delivered"
          labels={["Pontos Entregues", "Pontos A Entregar"]}
          data={[
            metricsService.returnTasksPoints(
              metricsService.returnAllTasksByWorkItemType(
                metricsService.returnTasksCompleted(tasks),
                "User Story"
              )
            ),
            metricsService.returnTasksPoints(
              metricsService.returnAllTasksByWorkItemType(
                metricsService.returnTasksNotCompleted(tasks),
                "User Story"
              )
            ),
          ]}
        />

        <GenericTable
          title="Bugs by state"
          labels={metricsService.returnStates(
            metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
          )}
          data={metricsService.returnArraySprintTasksStateCount(
            metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
          )}
        />
        <GenericTable
          title="User Story X Bugs X Improvements"
          labels={["User Story", "Bug", "Improvements"]}
          data={[
            metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
              .length,
            metricsService.returnAllTasksByWorkItemType(tasks, "Bug").length,
            metricsService.returnAllTasksByWorkItemTag(tasks, "Melhoria").length,
          ]}
        />
      </Stack>
    </Box>
  );
}
