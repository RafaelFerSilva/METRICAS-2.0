import { Select, Button, VStack, HStack, Box, Stack, Text, Divider, Heading } from "@chakra-ui/react";
import { useState } from "react";

interface FilterComponentProps {
  filters: { field: string; value: string }[];
  setFilters: (filters: { field: string; value: string }[]) => void;
  processedData: any[];
  labels: string[];
}

// Função para pegar o último item após o ponto no header
const getHeaderDisplayName = (header: string) => {
  if (header === "Custom.ec38de40-257b-4c45-9db9-284080382c3e") {
    return "AutomationStatus";
  }
  if (header === "Custom.e0ac16d1-5c7a-42f5-8111-be8b335c9e8e") {
    return "Origin";
  }
  const parts = header.split(".");
  return parts[parts.length - 1];
};

export default function FilterComponent({
  filters,
  setFilters,
  processedData,
  labels,
}: FilterComponentProps) {
  const [newFilter, setNewFilter] = useState<{ field: string; value: string }>({
    field: "",
    value: "",
  });

  const availableFields = labels.filter(
    (label) => !filters.some((filter) => filter.field === label)
  );

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.value) {
      const updatedFilters = [...filters, newFilter];
      setFilters(updatedFilters);
      setNewFilter({ field: "", value: "" });
    }
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
  };

  const handleClearFilters = () => {
    setFilters([]);
    setNewFilter({ field: "", value: "" });
  };

  const availableValues = (selectedField: string) => {
    const uniqueValues = new Set(
      processedData.map((item) => item[selectedField]).filter((val) => val)
    );
    return Array.from(uniqueValues);
  };

  return (
    <VStack spacing={4} mb={4} align="stretch">
      <HStack spacing={2} wrap="wrap" justifyContent="flex-start">
        <Select
          placeholder="Select Field"
          value={newFilter.field}
          onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
          size="sm"
          width="250px"
        >
          {availableFields.map((label) => (
            <option key={label} value={label}>
              {getHeaderDisplayName(label)}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Select Value"
          value={newFilter.value}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          isDisabled={!newFilter.field}
          size="sm"
          width="350px"
        >
          {newFilter.field
            ? availableValues(newFilter.field).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))
            : null}
        </Select>
        <Button onClick={handleAddFilter} colorScheme="blue" size="sm">
          Add Filter
        </Button>
        <Button onClick={handleClearFilters} colorScheme="red" size="sm">
          Clear Filters
        </Button>
      </HStack>

      {/* Seção de Filtros Selecionados, só aparece se houver filtros */}
      {filters.length > 0 && (
        <Box p={4} borderWidth={1} borderColor="gray.200" borderRadius="md" bg="gray.50">
          <Heading size="sm" mb={2}>
            Selected Filters
          </Heading>
          <Divider mb={2} />
          <Stack spacing={2}>
            {filters.map((filter, index) => (
              <HStack key={index} spacing={2}>
                <Box>
                  {getHeaderDisplayName(filter.field)}: {filter.value}
                </Box>
                <Button onClick={() => handleRemoveFilter(index)} colorScheme="teal" size="sm">
                  Remove
                </Button>
              </HStack>
            ))}
          </Stack>
        </Box>
      )}
    </VStack>
  );
}
