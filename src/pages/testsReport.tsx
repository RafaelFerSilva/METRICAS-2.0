import { useState } from "react";
import { Box, Flex, Grid, GridItem, HStack, Button } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { PipelineProvider } from "../contexts/PipelineContext";
import { AllRunsProvider } from "../contexts/AllRunsContext";

import PipelineSelect from "../components/PipelineSelect";
import RunsSelect from "../components/RunsSelect";
import RunSummary from "../components/RunSummary";
import { withSession } from "../services/auth/session";
import { setupAPIMetrics } from "../services/api";
import { tokenService } from "../services/auth/tokenService";
import { useToast } from '@chakra-ui/react'

interface Pipeline {
  id: string;
  name: string;
  url: string;
}

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

interface Run {
  id: string;
  name: string;
  url: string;
  finishedDate: string;
  createdDate: string;
  result: string;
  state: string;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function TestsReport() {
  const [runTests, setRunTests] = useState<RunTestItens[]>()
  const [runCondensedData, setRunCondensedData] = useState<RunsCondensedData>()
  const [selectPipelineRuns, setPipelineRuns] = useState<Run[]>();
  const [runId, setRunsId] = useState<any>();
  const toast = useToast()

  async function handleCreateNewReport(event: any) {
    event.preventDefault();

    if (runId !== undefined) {
      await axiosInstance
        .get(`https://dev.azure.com/${organization}/Satelital/_apis/test/Runs/${runId.id}`)
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
            }
            setRunCondensedData(condensedData)
          }
        });

      await axiosInstance
        .get(`https://dev.azure.com/${organization}/${project_id}/_apis/test/Runs/${runId.id}/results?api-version=6.0`)
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
  }

  return (
    <PipelineProvider>
      <AllRunsProvider>
        <Flex direction="column" h="100vh">
          <Grid h="200px" templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={5} m="1">
              <Header />
            </GridItem>
            <GridItem colSpan={5} mr="2">
              <>
                <Flex direction="column" ml="1" justify="center" gap="2">
                  <Box display="flex" borderRadius={8} bg="white" p={["6", "8"]} gap="5">
                    <PipelineSelect setPipelineRuns={setPipelineRuns} />
                    {selectPipelineRuns && (
                      <Box display="flex" gap="4" as="form" onSubmit={handleCreateNewReport}>
                        <RunsSelect
                          runs={selectPipelineRuns}
                          setRunsId={setRunsId}
                          setRunCondensedData={setRunCondensedData}
                        />
                        <HStack spacing="4">
                          <Button type="submit" colorScheme="blue" size="lg">
                            Search
                          </Button>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                </Flex>
              </>
            </GridItem>
          </Grid>
          {runCondensedData && (
            <>
                <RunSummary runCondensedData={runCondensedData} />
            </>
          )}
          {/* {runTests && (
          <div >
            {runTests.map((test: RunTestItens) => {
            return (
              <div key={test.id}>
                <p >{test.build}</p>
                <p>{test.automatedTestName}</p>
              </div>
            )
          })}
          </div>
        ) 
        } */}
        </Flex>
      </AllRunsProvider>
    </PipelineProvider>

  );
}

// Decorator Pattern
export const getServerSideProps = withSession((ctx: any) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});