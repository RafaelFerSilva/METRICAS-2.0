import { Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AllRunsContext } from "../../contexts/AllRunsContext";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";

interface Run {
  id: string;
  name: string;
  url: string;
  finishedDate: string;
  createdDate: string;
  result: string;
  state: string;
}

interface RunsItens {
  id: string;
}

interface SelectRunsProps {
  runs: Run[];
  setRunsId?: (runs: any) => void;
  setRunCondensedData?: (runs: any) => void
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function RunsSelect({
  runs,
  setRunsId,
  setRunCondensedData
}: SelectRunsProps) {
  const [selectedRun, setSeletedRun] = useState("");
  const runsItens = useContext(AllRunsContext);

  const returnSelectRunsData = (id: string) => {
    let selectRuns = runsItens.filter(function (run: any) {
      return (
        run.build.id === id
      );
    });
    let selectedRunId: RunsItens = {
      id: selectRuns[0].id,
    }

    return selectedRunId
  }

  const handleChange = (event: any) => {
    event.preventDefault();
    setSeletedRun(event.target.value);
    setRunCondensedData([])
    if (runs.length != 0) {
      const runsData = returnSelectRunsData(event.target.value)
      setRunsId(runsData)
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
