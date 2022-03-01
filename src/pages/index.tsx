import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { Header } from "../components/Header";
import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import SelectSprintForm from "../components/SelectSprint";
import { GraphicBoard } from "../components/GraphicBoard";
import { UsHistory } from "../components/UsHistory";
import Report from "../data/report";
import { RelatedBugs } from "../components/RelatedBugs";

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
                    <Tab>Graphics</Tab>
                    <Tab>Tasks</Tab>
                    <Tab>Related Bug</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <GraphicBoard tasks={tasks} />
                    </TabPanel>
                    <TabPanel>
                      <UsHistory tasks={tasks} workItemType="User Story" />
                    </TabPanel>
                    <TabPanel>
                      {report
                        .returnAllTasksByWorkItemType(tasks, "User Story")
                        .map((task) => {
                          return <RelatedBugs key={task.ID} task={task} />;
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
