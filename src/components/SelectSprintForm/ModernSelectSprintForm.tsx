import React, { useState } from "react";
import { Box, Text, useToast, HStack, Badge, VStack } from "@chakra-ui/react";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";
import NewTasks from "../../model/tasks";
import SearchableSelect from "../SearchableSelect";
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
  name?: string;
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

const token = tokenService.getToken();
const project_id = tokenService.getProjectId();
const organization = tokenService.getOrganization();

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function ModernSelectSprintForm({
  teamId,
  sprint,
  setTasks,
  setIsLoading
}: SelectSprintProps) {
  const [selectedSprint, setSelectedSprint] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const toast = useToast();

  // Converter sprints para o formato do SearchableSelect
  const sprintOptions = sprint.map((sprintItem) => {
    const startDate = sprintItem.attributes?.startDate 
      ? new Date(sprintItem.attributes.startDate).toLocaleDateString('pt-BR')
      : '';
    const finishDate = sprintItem.attributes?.finishDate 
      ? new Date(sprintItem.attributes.finishDate).toLocaleDateString('pt-BR')
      : '';
    
    const dateRange = startDate && finishDate ? ` (${startDate} - ${finishDate})` : '';
    
    return {
      value: sprintItem.id,
      label: `${sprintItem.name}${dateRange}`,
    };
  });

  const handleChange = async (sprintId: string) => {
    if (!sprintId) {
      setTasks && setTasks([]);
      return;
    }

    setSelectedSprint(sprintId);
    setIsLoadingData(true);
    setIsLoading && setIsLoading(true);

    try {
      // Buscar work items da sprint
      const workItemsResponse = await axiosInstance.get(
        `https://dev.azure.com/${organization}/${project_id}/${teamId.id}/_apis/work/teamsettings/iterations/${sprintId}/workitems?api-version=6.0-preview.1`
      );

      let workItems: number[] = [];
      if (workItemsResponse.status === 200 && workItemsResponse.data.workItemRelations) {
        workItems = workItemsResponse.data.workItemRelations.map((item: any) => item.target.id);
      }

      if (workItems.length === 0) {
        setTasks && setTasks([]);
        toast({
          title: "Sprint sem dados",
          description: "Esta sprint não possui itens de trabalho ou ainda não foi iniciada.",
          status: "info",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      // Buscar detalhes dos work items
      const workItemDetailsResponse = await axiosInstance.get(
        `wit/workitems?ids=${workItems.join(',')}&expand=all&api-version=6.0`
      );

      if (workItemDetailsResponse.status === 200) {
        const newTasks = new NewTasks();
        const formattedTasks: Task[] = newTasks.formatJson(workItemDetailsResponse.data.value);
        
        setTasks && setTasks(formattedTasks);
        
        // Encontrar a sprint selecionada para mostrar informações
        const selectedSprintData = sprint.find(s => s.id === sprintId);
        
        toast({
          title: "Sprint carregada com sucesso!",
          description: `${formattedTasks.length} itens carregados da sprint "${selectedSprintData?.name}"`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados da sprint:", error);
      setTasks && setTasks([]);
      toast({
        title: "Erro ao carregar sprint",
        description: "Não foi possível carregar os dados da sprint selecionada. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoadingData(false);
      setIsLoading && setIsLoading(false);
    }
  };

  // Encontrar a sprint selecionada para mostrar informações adicionais
  const selectedSprintData = sprint.find(s => s.id === selectedSprint);

  return (
    <VStack spacing={3} align="stretch">
      <SearchableSelect
        options={sprintOptions}
        placeholder="Pesquisar e selecionar sprint..."
        value={selectedSprint}
        onChange={handleChange}
        isDisabled={isLoadingData || sprint.length === 0}
        size="md"
      />
      
      {sprint.length === 0 && (
        <Text fontSize="sm" color="gray.500">
          Selecione um time primeiro para ver as sprints disponíveis
        </Text>
      )}
      
      {isLoadingData && (
        <Text fontSize="sm" color="blue.500">
          Carregando dados da sprint...
        </Text>
      )}

      {selectedSprintData && (
        <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <VStack spacing={2} align="start">
            <HStack spacing={2} wrap="wrap">
              <Badge colorScheme="blue" variant="solid">
                {selectedSprintData.name}
              </Badge>
              <Badge 
                colorScheme={selectedSprintData.attributes?.timeFrame === "current" ? "green" : "gray"} 
                variant="outline"
              >
                {selectedSprintData.attributes?.timeFrame || "Indefinido"}
              </Badge>
            </HStack>
            
            {selectedSprintData.attributes?.startDate && selectedSprintData.attributes?.finishDate && (
              <HStack spacing={4} fontSize="sm" color="blue.700">
                <Text>
                  <strong>Início:</strong> {new Date(selectedSprintData.attributes.startDate).toLocaleDateString('pt-BR')}
                </Text>
                <Text>
                  <strong>Fim:</strong> {new Date(selectedSprintData.attributes.finishDate).toLocaleDateString('pt-BR')}
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}