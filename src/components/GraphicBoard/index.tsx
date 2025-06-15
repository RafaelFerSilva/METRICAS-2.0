import { Box, Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import Report from "../../data/report";
import { LineChart } from "../Charts/ChartLine";
import { VerticalBar } from "../Charts/ChartVerticalBar";
import { GenericTable } from "../GenericTable";
import { StateTable } from "../StateTable";
import { Summary } from "../Summary";
import { Task } from "../../types/Task";

interface GraphicBoardProps {
  tasks: Task[];
}

export function GraphicBoard({ tasks }: GraphicBoardProps) {
  const tagsNotExpected = ["Não prevista", 'Não previsto']
  const report = new Report();
  return (
    <>
      <Flex justifyContent="center">
        <Summary
          sprintTasks={
            report.returnAllTasksByWorkItemType(tasks, "User Story").length
          }
          resolvedTasks={
            report.returnAllTasksByWorkItemType(
              report.returnTasksCompleted(tasks),
              "User Story"
            ).length
          }
          unresolvedTasks={
            report.returnAllTasksByWorkItemType(
              report.returnTasksNotCompleted(tasks),
              "User Story"
            ).length
          }
          sprintPoints={report.returnTasksPoints(
            report.returnAllTasksByWorkItemType(tasks, "User Story")
          )}
          resolvedPoints={report.returnTasksPoints(
            report.returnAllTasksByWorkItemType(
              report.returnTasksCompleted(tasks),
              "User Story"
            )
          )}
          unresolvedPoints={report.returnTasksPoints(
            report.returnAllTasksByWorkItemType(
              report.returnTasksNotCompleted(tasks),
              "User Story"
            )
          )}
          bugs={report.returnAllTasksByWorkItemType(tasks, "Bug").length}
          melhorias={
            report.returnAllTasksByWorkItemType(tasks, "Melhoria").length
          }
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
            labels={report.returnTaskTitle(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={report.returnCicleTimeByWorkItemType(tasks, "User Story")}
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
            labels={report.returnTaskTitle(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={report.returnTasksStoryPoint(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
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
            labels={report.returnStates(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={report.returnArraySprintTasksStateCount(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            label="Tasks by State State"
          />
          <GenericTable
            title=""
            labels={report.returnStates(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={report.returnArraySprintTasksStateCount(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
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
            label="User Story Points"
          />
          <GenericTable
            title=""
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
            labels={report.returnTaskTitle(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={report.returnCicleTimeByWorkItemType(tasks, "Bug")}
            label="Cycle Time"
          />
          <GenericTable
            title=""
            labels={report.returnTaskID(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={report.returnCicleTimeByWorkItemType(tasks, "Bug")}
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
            labels={report.returnStates(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={report.returnArraySprintTasksStateCount(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            label="Bugs by state"
          />

          <GenericTable
            title=""
            labels={report.returnStates(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={report.returnArraySprintTasksStateCount(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
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
            title="User Story X Bugs X Improvements"
            labels={["User Story", "Bug", "Improvements", "Not Expected"]}
            data={[
              report.returnAllTasksByWorkItemType(tasks, "User Story").length,
              report.returnAllTasksByWorkItemType(tasks, "Bug").length,
              report.returnAllTasksByWorkItemTag(tasks, "Melhoria").length,
              report.returnTagsList(tagsNotExpected, tasks).length
            ]}
            label="Amount of USs"
          />

          <GenericTable
            title=""
            labels={["User Story", "Bug", "Improvements", "Not Expected"]}
            data={[
              report.returnAllTasksByWorkItemType(tasks, "User Story").length,
              report.returnAllTasksByWorkItemType(tasks, "Bug").length,
              report.returnAllTasksByWorkItemTag(tasks, "Melhoria").length,
              report.returnTagsList(tagsNotExpected, tasks).length
            ]}
          />
        </Box>
      </Flex>
    </>
  );
}
