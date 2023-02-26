import { withSession } from "../services/auth/session";
import {
  Box,
  Flex,
} from "@chakra-ui/react";

import { Header } from "../components/Header";
import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import { TeamsProvider } from "../contexts/TeamsContext";
import ReportTabs from "../components/ReportTabs";
import SelectSprintForm from "../components/SelectSprintForm";
import TeamSelect from "../components/TeamSelect";

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

  return (
    <TeamsProvider>
      <Flex direction="column" h="100vh">
        <Grid templateColumns="repeat(5, 1fr)">
          <GridItem colSpan={5}>
            <Header />
          </GridItem>
          <GridItem colSpan={5} >
            <Flex direction="column" justify="center" gap="2">
              <Box display="flex" mt="1px" bg="white" p={["6", "8"]} gap="5">
                <TeamSelect setSprint={setSprint} setTask={setTasks} setTeam={setSprintTeam} />
                {sprintTeam && <SelectSprintForm  teamId={sprintTeam} sprint={sprint} setTasks={setTasks} />}
              </Box>
              {tasks.length !== 0 && <ReportTabs tasks={tasks} />}
            </Flex>
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
