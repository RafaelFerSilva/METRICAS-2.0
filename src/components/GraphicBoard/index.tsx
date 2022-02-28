import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import Report from "../../data/report";
import { LineChart } from "../Charts/ChartLine";
import { VerticalBar } from "../Charts/ChartVerticalBar";
import { Summary } from "../Summary";

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

interface GraphicBoardProps {
  tasks: Task[];
}

export function GraphicBoard({ tasks }: GraphicBoardProps) {
  const report = new Report();
  return (
    <>
      <Box width="100%">
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
      </Box>

      <Flex justifyContent="center" >
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px" minWidth="720px"
        >
          <LineChart
            data={report.returnLifeCicleByWorkItemType(tasks, "User Story")}
            title="Ciclo de vida das User Story"
            label="Número de Dias:"
          />
        </Box>
      </Flex>

      <Flex justifyContent="center" >

        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px" minWidth="720px"
        >
          <VerticalBar
            title="Pontos por User Story"
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

      <Flex justifyContent="center" >
      <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px" minWidth="720px"
        >
          <VerticalBar
            title="User Story por State"
            labels={report.returnStates(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            data={report.returnArraySprintTasksStateCount(
              report.returnAllTasksByWorkItemType(tasks, "User Story")
            )}
            label="Tasks por State"
          />
        </Box>
      </Flex >

      <Flex justifyContent="center" >
      <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px" minWidth="720px"
        >
          <VerticalBar
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
            label="User Story Points"
          />
        </Box>
       </Flex >

      <Flex justifyContent="center" >
      <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px" minWidth="720px"
        >
          <LineChart
            data={report.returnLifeCicleByWorkItemType(tasks, "Bug")}
            title="Ciclo de vida dos Bugs"
            label="Número de Dias:"
          />
        </Box>
       </Flex >

      <Flex justifyContent="center" >
      <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px" minWidth="720px"
        >
          <VerticalBar
            title="Bugs por State"
            labels={report.returnStates(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            data={report.returnArraySprintTasksStateCount(
              report.returnAllTasksByWorkItemType(tasks, "Bug")
            )}
            label="Bugs por State"
          />
        </Box>
       </Flex >

      <Flex justifyContent="center" >
      <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          maxWidth="1020px" minWidth="720px"
        >
          <VerticalBar
            title="User Story X Bugs X Melhorias"
            labels={["User Story", "Bug", "Melhorias"]}
            data={[
              report.returnAllTasksByWorkItemType(tasks, "User Story").length,
              report.returnAllTasksByWorkItemType(tasks, "Bug").length,
              report.returnAllTasksByWorkItemTag(tasks, "Melhoria").length,
            ]}
            label="Quantidade de USs"
          />
        </Box>
       </Flex >

      <SimpleGrid >
     

        
        
       
       
        
      </SimpleGrid>
    </>
  );
}
