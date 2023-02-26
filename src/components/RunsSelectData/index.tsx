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
  setRunsCondensedData: (run: RunsCondensedData) => void;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function RunsSelectData({
  runs,
  setRunsCondensedData
}: SelectRunsProps) {
  const [selectedRun, setSeletedRun] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const runsItens = useContext(AllRunsContext);
  const toast = useToast()

  const returnSelectRunsData = (id: string) => {
    let selectedRunId: RunsId;
    let selectRuns = runsItens.filter(function (run: any) {
      return (
        run.build.id === id
      );
    });

    if (selectRuns.length !== 0) {
      selectedRunId = {
        id: selectRuns[0].id,
      }
    }

    return selectedRunId
  }

  const handleChange = async (event: any) => {
    event.preventDefault();
    setSeletedRun(event.target.value);
    const runsData = returnSelectRunsData(event.target.value)

    let condensedData: RunsCondensedData;

    if (runsData !== undefined) {
      await axiosInstance
        .get(`https://dev.azure.com/${organization}/Satelital/_apis/test/Runs/${runsData.id}`)
        .then((response) => {
          if (response.status === 200) {
            condensedData = {
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
            setRunsCondensedData(condensedData)
          }
        });

    } else {
      toast({
        title: `Esta pipeline não tem dados para serem exibidos. Provavelmente não foi finalizada ou foi cancelada. `,
        status: 'warning',
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
              size="md"
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
