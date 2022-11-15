import { Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AllRunsContext } from "../../contexts/AllRunsContext";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";
import { useToast } from '@chakra-ui/react'

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

interface Run {
  id: string;
  name: string;
  url: string;
  finishedDate: string;
  createdDate: string;
  result: string;
  state: string;
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
}


interface RunsId {
  id: string;
}

interface SelectRunsProps {
  runs: Run[];
  setRunsId?: (runs: any) => void;
  setRunCondensedData: (run: RunsCondensedData) => void;
  setRunTests: (tests: RunTestItens[]) => void;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function RunsSelect({
  runs,
  setRunCondensedData,
  setRunTests
}: SelectRunsProps) {
  const [selectedRun, setSeletedRun] = useState("");
  const runsItens = useContext(AllRunsContext);
  const toast = useToast()

  const returnSelectRunsData = (id: string) => {
    let selectRuns = runsItens.filter(function (run: any) {
      return (
        run.build.id === id
      );
    });
    let selectedRunId: RunsId = {
      id: selectRuns[0].id,
    }

    return selectedRunId
  }

  const handleChange = async (event: any) => {
    event.preventDefault();
    setSeletedRun(event.target.value);
    const runsData = returnSelectRunsData(event.target.value)

    if (runsData !== undefined) {
      await axiosInstance
        .get(`https://dev.azure.com/${organization}/Satelital/_apis/test/Runs/${runsData.id}`)
        .then((response) => {
          if (response.status === 200) {
            let condensedData: RunsCondensedData = {
              id: response.data.id,
              name: response.data.name,
              startedDate: response.data.startedDate,
              completedDate: response.data.completedDate,
              state: response.data.state,
              build: response.data.build.id,
              pipelineId: response.data.pipelineReference.pipelineId,
              totalTests: response.data.totalTests,
              passedTests: response.data.passedTests,
              incompleteTests: response.data.incompleteTests,
              unanalyzedTests: response.data.unanalyzedTests,
              notApplicableTests: response.data.notApplicableTests,
              postProcessState: response.data.notApplicableTests,
              url: `https://dev.azure.com/${organization}/Satelital/_build/results?buildId=${response.data.build.id}&view=results`
            }
            setRunCondensedData(condensedData)
          }
        });

      await axiosInstance
        .get(`https://dev.azure.com/${organization}/${project_id}/_apis/test/Runs/${runsData.id}/results?api-version=6.0`)
        .then((response) => {
          if (response.status === 200) {
            let tests: RunTestItens[] = []
            response.data.value.map((test: any) => {
              let testItem: RunTestItens = {
                id: test.id,
                automatedTestName: test.automatedTestName,
                automatedTestStorage: test.automatedTestStorage,
                build: test.build.id,
                startedDate: test.startedDate,
                completedDate: test.completedDate,
                createdDate: test.createdDate,
                durationInMs: test.durationInMs,
                outcome: test.outcome,
                priority: test.priority,
                state: test.state,
                testCaseReferenceId: test.testCaseReferenceId,
                testRun: test.testRun.id,
              }

              tests.push(testItem)
            })
            setRunTests(tests)
          }
        });

    } else {
      toast({
        title: `Nenhuma run foi selecionada ou esta pipeline não tem dados para serem exibidos!!!`,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      })
    }

  };

  return (
    <>
      <VStack spacing="8">
        <SimpleGrid
          minChildWidth="240px"
          spacing={["6", "8"]}
          alignSelf="flex-start"
        >
          <VStack spacing={3}>
            <Select
              placeholder="Pepiline Runs"
              size="lg"
              onChange={(ev) => handleChange(ev)}
              value={selectedRun}
            >
              {runs.map((run: Run) => {
                return (
                  <option key={run.id} value={run.id}>
                    {run.name}
                  </option>
                );
              })}
            </Select>
          </VStack>
        </SimpleGrid>
      </VStack>
    </>
  );
}
