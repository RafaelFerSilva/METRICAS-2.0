// import { withSession } from "../services/auth/session";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Text
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { TeamsProvider } from "../../contexts/TeamsContext";
import TeamSelect from "../TeamSelect";
import Loading from '../Loading';
import { tokenService } from "../../services/auth/tokenService";
import { setupAPIMetrics } from "../../services/api";
import NewTasks from "../../model/tasks";
import CompareSprints from "../CompareSprints";
import { Task } from "../../types/Task";

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

interface sprintTasks {
  tasks: Task[];
  sprintid: string
  sprintName: string
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function SprintCompare() {
  // const [sprintTasks, setSprintTasks] = useState<sprintTasks[]>([])
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintTeam, setSprintTeam] = useState<Team>();
  const [sprint, setSprint] = useState<Iterations[]>([]);

return (
  <TeamsProvider>
    <Flex direction="column" h="100vh">
      <Grid templateColumns="repeat(5, 1fr)">
        <GridItem colSpan={5} >
          <Flex direction="column" justify="center" >
            <Box display="flex" mt="1px" bg="white" p={3} gap={5}>
              <Text mt="1">Comparison of sprints</Text>
              <TeamSelect setSprint={setSprint} setTask={setTasks} setTeam={setSprintTeam} />
            </Box>
           {sprint.length > 0 && <CompareSprints sprint={sprint} sprintTeam={sprintTeam} />}
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  </TeamsProvider>
);
}

// Decorator Pattern
// export const getServerSideProps = withSession((ctx: any) => {
//   return {
//     props: {
//       session: ctx.req.session,
//     },
//   };
// });
