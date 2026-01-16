import { Box, Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import { SprintMetricsService } from "../../../core/domain/services/sprint-metrics.service";
import { LineChart } from "../Charts/ChartLine";
import { VerticalBar } from "../Charts/ChartVerticalBar";
import { GenericTable } from "../GenericTable";
import { StateTable } from "../StateTable";
import { Summary } from "../Summary";
import { Task } from "../../../core/shared/types/Task";

interface GraphicBoardProps {
  tasks: Task[];
}

const metricsService = new SprintMetricsService();

export function GraphicBoard({ tasks }: GraphicBoardProps) {

  return (
    <>
      <Flex justifyContent="center">
        <Summary
          sprintTasks={
            metricsService.returnAllTasksByWorkItemType(tasks, "User Story").length
          }
          resolvedTasks={
            metricsService.returnAllTasksByWorkItemType(
              metricsService.returnTasksCompleted(tasks),
              "User Story"
            ).length
          }
          unresolvedTasks={
            metricsService.returnAllTasksByWorkItemType(
              metricsService.returnTasksNotCompleted(tasks),
              "User Story"
            ).length
          }
          sprintPoints={metricsService.returnTasksPoints(
            metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
          resolvedPoints={metricsService.returnTasksPoints(
            metricsService.returnAllTasksByWorkItemType(
              metricsService.returnTasksCompleted(tasks),
              "User Story"
            )
          )}
          unresolvedPoints={metricsService.returnTasksPoints(
            metricsService.returnAllTasksByWorkItemType(
              metricsService.returnTasksNotCompleted(tasks),
              "User Story"
            )
          )}
          bugs={metricsService.returnAllTasksByWorkItemType(tasks, "Bug").length}
        />
      </Flex>

      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
            title="User Story Cycle Time"
            labels={metricsService.returnTaskTitle(
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={metricsService.returnCicleTimeByWorkItemType(tasks, "User Story")}
            label="Cycle Time"
          />
        </Box>
      </Flex>

      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
            title="Points per User Story"
            labels={metricsService.returnTaskTitle(
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={metricsService.returnTasksStoryPoint(
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            label="Story Points"
          />
        </Box>
      </Flex>

      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
            title="User Story for State"
            labels={metricsService.returnStates(
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={metricsService.returnArraySprintTasksStateCount(
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            label="Tasks by State State"
          />
          <GenericTable
            title=""
            labels={metricsService.returnStates(
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={metricsService.returnArraySprintTasksStateCount(
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
          />
        </Box>
      </Flex>

      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
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
            label="User Story Points"
          />
          <GenericTable
            title=""
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
        </Box>
      </Flex>

      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
            title="Bug Cycle Time"
            labels={metricsService.returnTaskTitle(
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={metricsService.returnCicleTimeByWorkItemType(tasks, "Bug")}
            label="Cycle Time"
          />
          <GenericTable
            title=""
            labels={metricsService.returnTaskID(
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={metricsService.returnCicleTimeByWorkItemType(tasks, "Bug")}
          />
        </Box>
      </Flex>

      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
            title="Bugs by state"
            labels={metricsService.returnStates(
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={metricsService.returnArraySprintTasksStateCount(
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            label="Bugs by state"
          />

          <GenericTable
            title=""
            labels={metricsService.returnStates(
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={metricsService.returnArraySprintTasksStateCount(
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
          />
        </Box>
      </Flex>

      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
            title="User Story X Bugs"
            labels={["User Story", "Bug"]}
            data={[
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story").length,
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug").length
            ]}
            label="Amount of USs"
          />

          <GenericTable
            title=""
            labels={["User Story", "Bug"]}
            data={[
              metricsService.returnAllTasksByWorkItemType(tasks, "User Story").length,
              metricsService.returnAllTasksByWorkItemType(tasks, "Bug").length
            ]}
          />
        </Box>
      </Flex>
    </>
  );
}
