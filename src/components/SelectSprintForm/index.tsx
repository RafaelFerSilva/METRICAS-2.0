import { Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";
import NewTasks from "../../model/tasks";
import { useToast } from '@chakra-ui/react'
import { Task } from "../../types/Task";

export interface WorkRelations {
  rel: string;
  source: string;
  target: {
    id: number;
    url: string;
  };
}


interface Team {
  id: string;
}

interface SelectSprintProps {
  teamId: Team;
  sprint: Iterations[];
  setworkItemRelations?: (itemRelations: WorkRelations[]) => void;
  setTasks?: (task: Task[]) => void;
  setIsLoading?: (isLoading: boolean) => void;
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

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function SelectSprintForm({
  teamId,
  sprint,
  setTasks,
  setIsLoading
}: SelectSprintProps) {
  const [selectedSprint, setSeletedSprint] = useState("");
  const toast = useToast()
  let countReturnSprints = 25

  const handleChange = async (event: any) => {
    setSeletedSprint(event.target.value);

    if (event.target.value) {
      let workitens: number[] = await axiosInstance
        .get(
          `https://dev.azure.com/${organization}/${project_id}/${teamId}/_apis/work/teamsettings/iterations/${event.target.value}/workitems?api-version=7.1-preview.1`
        )
        .then(async (response) => {
          let itens: any;
          if (response.status === 200) {
            itens = response.data.workItemRelations.map((item: any) => {
              return item.target.id;
            });
          }
          return itens;
        })

      if (workitens === undefined) {
        setTasks([]);
      } else if (workitens.length !== 0) {
        setIsLoading(true)
        await axiosInstance
          .get(`wit/workitems?ids=${workitens}&expand=all&api-version=7.1`)
          .then((response) => {
            if (response.status === 200) {
              const newTasks = new NewTasks();
              let formatedTasks: Task[] = newTasks.formatJson(
                response.data.value
              );
              setTasks(formatedTasks);
            }
            setIsLoading(false)
          });
      } else {
        setTasks([]);
        toast({
          title: `Nenhuma sprint foi selecionada ou esta sprint não tem dados para serem exibidos!!!`,
          status: 'warning',
          position: 'top-right',
          isClosable: true,
        })
      }

    } else {
      setTasks([]);
    }
  };

  return (
      <VStack spacing="8">
        <SimpleGrid
          minChildWidth="240px"
          spacing={["6", "8"]}
          alignSelf="flex-start"
        >
          <VStack spacing={3}>
            <Select
              borderRadius={6}
              size="sm"
              placeholder="Sprints"
              onChange={(ev) => handleChange(ev)}
              value={selectedSprint}
            >
              {sprint.slice(0, countReturnSprints).map((item: Iterations) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Select>
          </VStack>
        </SimpleGrid>
      </VStack>
  );
}
