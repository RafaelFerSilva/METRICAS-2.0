import { SimpleGrid, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTestRuns, useTestRunDetails, useTestRunResults } from "../../hooks/useTestRuns";
import { RunDetails } from "../../../core/domain/entities/run.entity";
import SearchableSelect from "../SearchableSelect";

interface RunsCondensedData {
  id: string;
  name: string;
  startedDate: string;
  completedDate: string;
  state: string;
  build: string;
  pipelineId: string;
  totalTests: string;
  passedTests: string;
  incompleteTests: string;
  unanalyzedTests: string;
  notApplicableTests: string;
  postProcessState: string;
  url: string;
}

// Ensure this matches whatever is passed in 'runs' prop (PipelineRun?)
interface PipelineRunOption {
  id: string;
  name: string;
}

interface RunTestItens {
  id: string;
  automatedTestName: string;
  automatedTestStorage: string;
  build: string;
  startedDate: string;
  completedDate: string;
  createdDate: string;
  durationInMs: string;
  outcome: string;
  priority: string;
  state: string;
  testCaseReferenceId: string;
  testRun: string;
  errorMessage: string;
}

interface SelectRunsProps {
  runs: PipelineRunOption[];
  setRunsId?: (runs: any) => void;
  setRunCondensedData: (run: RunsCondensedData) => void;
  setRunTests: (tests: RunTestItens[]) => void;
}

export default function RunsSelect({
  runs,
  setRunCondensedData,
  setRunTests
}: SelectRunsProps) {
  const [selectedPipelineRunId, setSelectedPipelineRunId] = useState("");
  const toast = useToast();

  // Find Test Run associated with the selected Pipeline Run ID (Build ID)
  // Only enabled when we have a selection
  const { data: testRuns, isLoading: isLoadingTestRun } = useTestRuns(true, true, selectedPipelineRunId || undefined);

  const { mutate: fetchDetails } = useTestRunDetails();
  const { mutate: fetchResults } = useTestRunResults();

  const handleRunChange = (value: string) => {
    setSelectedPipelineRunId(value);
  };

  useEffect(() => {
    if (!selectedPipelineRunId) return;

    // If testRuns loaded and empty, it means no Test Run for this Pipeline Run
    if (testRuns && testRuns.length === 0 && !isLoadingTestRun) {
      setRunTests([]);
      toast({
        title: `Esta pipeline não tem dados de teste.`,
        description: "Provavelmente não foi finalizada, cancelada ou não gerou testes.",
        status: 'warning',
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    if (testRuns && testRuns.length > 0) {
      const testRunId = testRuns[0].id; // Assumption: 1-to-1 mapping or we take latest? Gateway returns list.

      // Fetch Details
      fetchDetails(testRunId, {
        onSuccess: (data: RunDetails) => {
          const condensed: RunsCondensedData = {
            id: data.id,
            name: data.name,
            startedDate: data.createdDate,
            completedDate: data.finishedDate,
            state: data.state,
            build: data.buildId,
            pipelineId: data.pipelineId,
            totalTests: data.totalTests.toString(),
            passedTests: data.passedTests.toString(),
            incompleteTests: data.incompleteTests.toString(),
            unanalyzedTests: data.unanalyzedTests.toString(),
            notApplicableTests: data.notApplicableTests.toString(),
            postProcessState: data.postProcessState,
            url: data.url
          };
          setRunCondensedData(condensed);
        },
        onError: (err) => {
          console.error("Error fetching details", err);
        }
      });

      // Fetch Results
      fetchResults(testRunId, {
        onSuccess: (data) => {
          const tests: RunTestItens[] = data.map(t => ({
            id: t.id.toString(),
            automatedTestName: t.automatedTestName,
            automatedTestStorage: t.automatedTestStorage,
            build: t.buildId,
            startedDate: t.startedDate,
            completedDate: t.completedDate,
            createdDate: t.createdDate,
            durationInMs: t.durationInMs.toString(),
            outcome: t.outcome,
            priority: t.priority.toString(),
            state: t.state,
            testCaseReferenceId: t.testCaseReferenceId.toString(),
            testRun: t.testRunId,
            errorMessage: t.errorMessage
          }));
          setRunTests(tests);
        },
        onError: (err) => {
          console.error("Error fetching results", err);
        }
      });
    }

  }, [testRuns, selectedPipelineRunId, isLoadingTestRun, fetchDetails, fetchResults, setRunCondensedData, setRunTests, toast]);

  // Convert runs to SearchableSelect options format
  const runOptions = runs.map(run => ({
    value: run.id,
    label: run.name
  }));

  return (
    <>
      <VStack spacing="8">
        <SimpleGrid
          minChildWidth="240px"
          spacing={["6", "8"]}
          alignSelf="flex-start"
          w="100%"
        >
          <VStack spacing={3} align="stretch">
            <SearchableSelect
              options={runOptions}
              placeholder="Selecione um Pipeline Run"
              value={selectedPipelineRunId}
              onChange={handleRunChange}
              size="sm"
            />
          </VStack>
        </SimpleGrid>
      </VStack>
    </>
  );
}
