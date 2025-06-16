import React, { useContext, useState } from "react";
import { Box, Text, useToast } from "@chakra-ui/react";
import { TeamsContext } from "../../contexts/TeamsContext";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";
import SearchableSelect from "../SearchableSelect";

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

interface SelectTeamProps {
  setSprint: (sprints: Iterations[]) => void;
  setTeam: (team: Team) => void;
  setTask?: (task: any) => void;
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

export default function ModernTeamSelect({ setSprint, setTask, setTeam }: SelectTeamProps) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const teams = useContext(TeamsContext);
  const toast = useToast();

  // Converter teams para o formato do SearchableSelect
  const teamOptions = teams.map((team: Team) => ({
    value: team.id,
    label: team.name,
  }));

  const handleChange = async (teamId: string) => {
    if (!teamId) return;

    setIsLoading(true);
    setSprint([]);
    setTask && setTask([]);
    setSelectedTeam(teamId);
    
    // Encontrar o team object completo
    const selectedTeamObj = teams.find((team: Team) => team.id === teamId);
    if (selectedTeamObj) {
      setTeam(selectedTeamObj);
    }

    try {
      const countReturnSprint = 25;
      const response = await axiosInstance.get(
        `https://dev.azure.com/${organization}/${project_id}/${teamId}/_apis/work/teamsettings/iterations?api-version=7.1`
      );

      if (response.status === 200) {
        setSprint(response.data.value.reverse().slice(0, countReturnSprint));
        toast({
          title: "Time selecionado com sucesso!",
          description: `${response.data.value.length} sprints carregadas`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar sprints:", error);
      toast({
        title: "Erro ao carregar sprints",
        description: "Não foi possível carregar as sprints do time selecionado",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <SearchableSelect
        options={teamOptions}
        placeholder="Pesquisar e selecionar time..."
        value={selectedTeam}
        onChange={handleChange}
        isDisabled={isLoading || teams.length === 0}
        size="sm"
      />
      {teams.length === 0 && (
        <Text fontSize="sm" color="gray.500" mt={2}>
          Nenhum time disponível
        </Text>
      )}
      {isLoading && (
        <Text fontSize="sm" color="blue.500" mt={2}>
          Carregando sprints...
        </Text>
      )}
    </Box>
  );
}