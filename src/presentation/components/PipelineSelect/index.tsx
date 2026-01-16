import { SimpleGrid, VStack, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { PipelineContext } from "../../contexts/PipelineContext";
import { usePipelineRuns } from "../../hooks/usePipelineRuns";
import SearchableSelect from "../SearchableSelect";

interface Pipeline {
  id: string;
  name: string;
  url: string;
}

interface SelectPipelineProps {
  setPipelineRuns: (item: any) => void;
  setRunCondensedData: (item: any) => void;
  setRunTests: (item: any) => void;
}

export default function PipelineSelect({ setPipelineRuns, setRunCondensedData, setRunTests }: SelectPipelineProps) {
  const [selectedPipeline, setSeletedPepiline] = useState("");
  const pipelines = useContext(PipelineContext);

  // Use the Custom Hook (Clean Architecture)
  const { data: runsData, isLoading, isError } = usePipelineRuns(selectedPipeline);

  // Sync with parent state (Legacy support)
  useEffect(() => {
    if (runsData) {
      setPipelineRuns(runsData);
    } else {
      setPipelineRuns([]);
    }
  }, [runsData, setPipelineRuns]);

  const handleChange = (value: string) => {
    setSeletedPepiline(value);
    setRunCondensedData([]);
    setRunTests([]);
    setPipelineRuns([]); // Clear runs while loading new ones
  };

  // Convert pipelines to SearchableSelect options
  const pipelineOptions = pipelines.map((pipeline: Pipeline) => ({
    value: pipeline.id,
    label: pipeline.name
  }));

  return (
    <VStack spacing="8">
      <SimpleGrid
        minChildWidth="240px"
        spacing={["6", "8"]}
        alignSelf="flex-start"
        w="100%"
      >
        <VStack spacing={3} align="stretch">
          <SearchableSelect
            options={pipelineOptions}
            placeholder="Selecione um Pipeline"
            value={selectedPipeline}
            onChange={handleChange}
            isDisabled={isLoading && !!selectedPipeline}
            size="sm"
          />
          {isLoading && <Spinner size="sm" color="blue.500" alignSelf="center" />}
        </VStack>
      </SimpleGrid>
    </VStack>
  );
}
