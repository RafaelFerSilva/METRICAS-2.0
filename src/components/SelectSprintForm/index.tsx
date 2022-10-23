import { Box, Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NewTasks from "../../model/tasks";
import { setupAPIMetrics } from "../../services/api";
import SprintSelect from "../SprintSelect";
import { useToast } from '@chakra-ui/react'
import { tokenService } from "../../services/auth/tokenService";

interface Team {
  id: string;
}

export interface WorkRelations {
  rel: string;
  source: string;
  target: {
    id: number;
    url: string;
  };
}

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

interface SelectSprintProps {
  team: Team;
  setTasks?: (task: Task[]) => any;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({organization, project_id ,token} );

export default function SelectSprint({ team, setTasks }: SelectSprintProps) {
  const [workItemRelations, setworkItemRelations] = useState<WorkRelations[]>(
    []
  );
  const toast = useToast()
  let workitens: number[];

  function setTasksList(items: WorkRelations[]) {
    workitens = items.map((item) => {
      return item.target.id;
    });
  }

  useEffect(() => {
    setTasksList(workItemRelations);
  });

  async function handleCreateNewReport(event: any) {
    event.preventDefault();

    if (workitens.length !== 0) {
      await axiosInstance
        .get(`wit/workitems?ids=${workitens}&expand=all&api-version=6.0`)
        .then((response) => {
          if (response.status === 200) {
            const newTasks = new NewTasks();
            let formatedTasks: Task[] = newTasks.formatJson(
              response.data.value
            );
            setTasks(formatedTasks);
          }
        });
    } else {
      toast({
        title: `Nenhuma sprint foi selecionada ou esta sprint não tem dados para serem exibidos!!!`,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      })
    }
  }

  return (
    <Box d="flex" gap="4" as="form" onSubmit={handleCreateNewReport}>
      <SprintSelect
        teamId={team}
        setworkItemRelations={setworkItemRelations}
        setTasks={setTasks}
      />
      <HStack spacing="4">
        <Button type="submit" colorScheme="blue" size="lg">
        Search
        </Button>
      </HStack>
    </Box>
  );
}
