import { Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { PipelineContext } from "../../contexts/PipelineContext";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";

interface Pipeline {
  id: string;
  name: string;
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

interface RunsItens {
  id: string;
}

interface SelectPipelineProps {
  setPipelineRuns: (item: any) => void;
  setRunCondensedData: (item: any) => void;
  setRunTests: (item: any) => void;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function PipelineSelect({ setPipelineRuns, setRunCondensedData, setRunTests }: SelectPipelineProps) {
  const [selectedPipeline, setSeletedPepiline] = useState("");
  const pipelines = useContext(PipelineContext);

  const handleChange = (event: any) => {
    event.preventDefault();
    setSeletedPepiline(event.target.value);
    setRunCondensedData([])
    setRunTests([])
    setPipelineRuns([])
  };

  useEffect(() => {

    const returnSelectPipelineData = (id: string) => {
      let pipeline = pipelines.filter(function (pipeline: Pipeline) {
        return (
          pipeline.id == id
        );
      });
  
      return pipeline
    }
    
    const pipelineData = returnSelectPipelineData(selectedPipeline)
    let runsData: Run[] | void;
    if(pipelineData[0] !== undefined) {
      const fetchPipelineRunList = async () => {
        runsData = await axiosInstance
          .get(
            `/pipelines/${pipelineData[0].id}/runs?api-version=7.1-preview.1`
          )
          .then((response) => {
            let runs: Run[] = []
            if (response.status === 200) {
              response.data.value.map(({ id, name, url, finishedDate, createdDate, result, state }: Run) => {
                let run: Run = {
                  id,
                  name,
                  url,
                  finishedDate,
                  createdDate,
                  result,
                  state
                }
                runs.push(run)
              });
  
              return (runs)
            }
          })
          
          setPipelineRuns(runsData);
      }
      fetchPipelineRunList()
    } else {
      setPipelineRuns([])
    }
  },[pipelines, selectedPipeline, setPipelineRuns])

  
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
              placeholder="Pipelines"
              borderRadius={6}
              size="sm"
              onChange={(ev) => handleChange(ev)}
              value={selectedPipeline}
            >
              {pipelines.map((pipeline: Pipeline) => {
                return (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
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
