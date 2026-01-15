import React, { useContext, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { TeamsContext } from "../../contexts/TeamsContext";
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
  onTeamSelected: (team: Team) => void;
}

export default function ModernTeamSelect({ onTeamSelected }: SelectTeamProps) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const teams = useContext(TeamsContext);

  // Converter teams para o formato do SearchableSelect
  const teamOptions = teams.map((team: Team) => ({
    value: team.id,
    label: team.name,
  }));

  const handleChange = (teamId: string) => {
    if (!teamId) return;

    setSelectedTeam(teamId);

    // Encontrar o team object completo
    const selectedTeamObj = teams.find((team: Team) => team.id === teamId);
    if (selectedTeamObj) {
      onTeamSelected(selectedTeamObj);
    }
  };

  return (
    <Box>
      <SearchableSelect
        options={teamOptions}
        placeholder="Pesquisar e selecionar time..."
        value={selectedTeam}
        onChange={handleChange}
        isDisabled={teams.length === 0}
        size="sm"
      />
      {teams.length === 0 && (
        <Text fontSize="sm" color="gray.500" mt={2}>
          Nenhum time disponível
        </Text>
      )}
    </Box>
  );
}