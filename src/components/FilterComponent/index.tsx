// src/components/FilterComponent/index.tsx
import { Select, Button, VStack, HStack, Box, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

interface FilterComponentProps {
  filters: { field: string; value: string }[];
  setFilters: (filters: { field: string; value: string }[]) => void;
  processedData: any[];
  labels: string[];
}

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
      <HStack spacing={4} justifyContent="flex-start">
        <Select
          placeholder="Select Field"
          value={newFilter.field}
          onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
          size="sm"
          width="300px"
        >
          {availableFields.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Select Value"
          value={newFilter.value}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          isDisabled={!newFilter.field}
          size="sm"
          width="450px"
        >
          {newFilter.field
            ? availableValues(newFilter.field).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))
            : null}
        </Select>
        <Button onClick={handleAddFilter} colorScheme="blue"  size="sm">
          Add Filter
        </Button>
        <Button onClick={handleClearFilters} colorScheme="red" size="sm">
          Clear Filters
        </Button>
      </HStack>

      <Stack spacing={2}>
        {filters.map((filter, index) => (
          <HStack key={index} spacing={2}>
            <Box>
              {filter.field}: {filter.value}
            </Box>
            <Button onClick={() => handleRemoveFilter(index)} colorScheme="teal" size="sm">
              Remove
            </Button>
          </HStack>
        ))}
      </Stack>
    </VStack>
  );
}
