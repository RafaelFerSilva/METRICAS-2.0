// import { withSession } from "../services/auth/session";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Text
} from "@chakra-ui/react";

import { useState } from "react";
import { TeamsProvider } from "../../contexts/TeamsContext";
import ReportTabs from "../ReportTabs";
import SelectSprintForm from "../SelectSprintForm";
import TeamSelect from "../TeamSelect";
import Loading from '../Loading';

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

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

export interface Iterations {
  id: string;
  name: string;
  path: string;
  attributes: {
    startDate: string;
    finishDate: string;
    timeFrame: string;
  };
  url: string;
}


export default function SprintReport() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintTeam, setSprintTeam] = useState<Team>();
  const [sprint, setSprint] = useState<Iterations[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderGraphic = () => {
    if (tasks.length > 0) {
        return  <ReportTabs tasks={tasks} />
    }
  }

  return (
    <TeamsProvider>
      <Flex direction="column" h="100vh">
        <Grid templateColumns="repeat(5, 1fr)">
          <GridItem colSpan={5} >
            <Flex direction="column" justify="center" >
              <Box display="flex" mt="1px" bg="white" p={3} gap={5}>
                <Text mt="1">Sprint Report</Text>
                <TeamSelect setSprint={setSprint} setTask={setTasks} setTeam={setSprintTeam} />
                {sprintTeam && <SelectSprintForm teamId={sprintTeam} sprint={sprint} setTasks={setTasks} setIsLoading={setIsLoading} />}
              </Box>
              {isLoading ? <Center height="100%" mt="20px">< Loading color='blue' type='spin' /></Center> : renderGraphic()}
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </TeamsProvider>
  );
}

