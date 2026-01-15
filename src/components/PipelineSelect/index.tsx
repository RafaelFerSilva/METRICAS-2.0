import { Select, SimpleGrid, VStack, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { PipelineContext } from "../../contexts/PipelineContext";
import { usePipelineRuns } from "../../presentation/hooks/usePipelineRuns";

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

  const handleChange = (event: any) => {
    event.preventDefault();
    setSeletedPepiline(event.target.value);
    setRunCondensedData([]);
    setRunTests([]);
    setPipelineRuns([]); // Clear runs while loading new ones
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
            placeholder="Pipelines"
            borderRadius={6}
            size="sm"
            onChange={handleChange}
            value={selectedPipeline}
            isDisabled={isLoading && !!selectedPipeline} // Disable while loading
          >
            {pipelines.map((pipeline: Pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </Select>
          {isLoading && <Spinner size="sm" color="blue.500" />}
        </VStack>
      </SimpleGrid>
    </VStack>
  );
}
