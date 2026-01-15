import React, { useState } from "react";
import { Box, Text, HStack, Badge, VStack } from "@chakra-ui/react";
import SearchableSelect from "../SearchableSelect";
import { Sprint } from "../../core/domain/entities/sprint.entity";

interface Team {
  id: string;
  name?: string;
}

interface SelectSprintProps {
  teamId: Team;
  sprint: Sprint[];
  onSprintSelected: (sprintId: string) => void;
  isLoading?: boolean;
}

export default function ModernSelectSprintForm({
  sprint,
  onSprintSelected,
  isLoading
}: SelectSprintProps) {
  const [selectedSprint, setSelectedSprint] = useState("");

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

  const handleChange = (sprintId: string) => {
    if (!sprintId) return;

    setSelectedSprint(sprintId);
    onSprintSelected(sprintId);
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
        isDisabled={isLoading || sprint.length === 0}
        size="sm"
      />

      {sprint.length === 0 && (
        <Text fontSize="sm" color="gray.500">
          Selecione um time primeiro para ver as sprints disponíveis
        </Text>
      )}

      {isLoading && (
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
