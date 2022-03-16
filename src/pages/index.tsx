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
import SelectSprintForm from "../components/SelectSprint";
import { GraphicBoard } from "../components/GraphicBoard";
import { UsHistory } from "../components/UsHistory";
import Report from "../data/report";
import { RelatedBugs } from "../components/RelatedBugs";

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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintTeam, setSprintTeam] = useState("");
  const report = new Report();

  return (
    <Flex direction="column" h="100vh">
      <Grid h="200px" templateColumns="repeat(5, 1fr)">
        <GridItem colSpan={5} m="1">
          <Header />
        </GridItem>
        <GridItem colSpan={5} mr="2" w="100%">
          <>
            <Flex direction="column" ml="1" justify="center" gap="2">
              <SelectSprintForm
                setTasks={setTasks}
                setSprintTeam={setSprintTeam}
              />
              {sprintTeam && (
                <Tabs size="md" variant="enclosed" bg="white">
                  <TabList>
                    <Tab>General</Tab>
                    <Tab>Tasks</Tab>
                    <Tab>Bugs</Tab>
                    <Tab>Melhorias</Tab>
                    <Tab>Related Bug</Tab>
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
                      <UsHistory tasks={tasks} workItemType="Bug" />
                    </TabPanel>
                    <TabPanel>
                      <UsHistory tasks={report.returnAllTasksByWorkItemTag(tasks, "Melhoria")} workItemType="User Story" />
                    </TabPanel>
                    <TabPanel>
                      {report
                        .returnAllTasksByWorkItemType(tasks, "User Story")
                        .map((task) => {
                          return <RelatedBugs key={task.ID} task={task} />;
                        })}
                    </TabPanel>
                    <TabPanel>
                      {report
                        .returnBugs(tasks)
                        .map((bug) => {
                          return (
                            <Box key={bug.ID} mb="8">
                              <Text>{bug.ID} - {bug.Title}</Text>
                              <Text><strong>Causa Raiz: </strong>{bug.Activity}</Text>
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
  );
}
