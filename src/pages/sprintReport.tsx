import { withSession } from "../services/auth/session";
import {
  Box,
  Divider,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { Header } from "../components/Header";
import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import SelectSprint from "../components/SelectSprint";
import { GraphicBoard } from "../components/GraphicBoard";
import { UsHistory } from "../components/UsHistory";
import Report from "../data/report";
import { Revisions } from "../components/Revisions";
import { TeamsProvider } from "../contexts/TeamsContext";

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

export default function SprintReport() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintTeam, setSprintTeam] = useState("");
  const report = new Report();

  return (
    <TeamsProvider>
      <Flex direction="column" h="100vh">
        <Grid templateColumns="repeat(5, 1fr)">
          <GridItem colSpan={5}>
            <Header />
          </GridItem>
          <GridItem colSpan={5} >
            <>
              <Flex direction="column"  justify="center" gap="2">
                <SelectSprint
                  setTasks={setTasks}
                  setSprintTeam={setSprintTeam}
                />
                {sprintTeam && (
                  <Tabs size="md" variant="enclosed" bg="white">
                    <TabList>
                      <Tab>General</Tab>
                      <Tab>State Graph</Tab>
                      <Tab>Board Column</Tab>
                      <Tab>Bugs</Tab>
                      <Tab>Improvements</Tab>
                      <Tab>Not Expected</Tab>
                      {/* <Tab>Related Bug</Tab> */}
                      <Tab>Bugs - Roots Causes</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <GraphicBoard tasks={tasks} />
                      </TabPanel>
                      <TabPanel>
                        <UsHistory tasks={tasks} workItemType="User Story" />
                      </TabPanel>
                      <TabPanel>
                        <Revisions tasks={tasks} workItemType="User Story" />
                      </TabPanel>
                      <TabPanel>
                        <UsHistory tasks={tasks} workItemType="Bug" />
                      </TabPanel>
                      <TabPanel>
                        {
                          report.returnAllTasksByWorkItemTag(tasks, "Melhoria").map((item, key) => {
                            return (
                              <Box key={key} mb="8">
                                <Text>{item.ID} - {item.Title}</Text>
                                <Divider />
                              </Box>
                            )
                          })
                        }
                      </TabPanel>
                      <TabPanel>
                        {
                          report.returnAllTasksByWorkItemTag(tasks, "não previsto").map((item, key) => {
                            return (
                              <Box key={key} mb="8">
                                <Text>{item.ID} - {item.Title}</Text>
                                <Divider />
                              </Box>
                            )
                          })
                        }
                      </TabPanel>
                      {/* <TabPanel>
                      {report
                        .returnAllTasksByWorkItemType(tasks, "User Story")
                        .map((task, key) => {
                          return <RelatedBugs key={key} task={task} />;
                        })}
                    </TabPanel> */}
                      <TabPanel>
                        {report
                          .returnBugs(tasks)
                          .map((bug, key) => {
                            return (
                              <Box key={key} mb="8">
                                <Text>{bug.ID} - {bug.Title}</Text>
                                <Text><strong>Root Cause: </strong>{bug.Activity}</Text>
                                <Divider />
                              </Box>
                            )
                          })}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                )}
              </Flex>
            </>
          </GridItem>
        </Grid>
      </Flex>
    </TeamsProvider>
  );
}

// Decorator Pattern
export const getServerSideProps = withSession((ctx: any) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});
