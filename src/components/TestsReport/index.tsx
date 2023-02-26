import { useState } from "react";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { PipelineProvider } from "../../contexts/PipelineContext";
import { AllRunsProvider } from "../../contexts/AllRunsContext";

import PipelineSelect from "../PipelineSelect";
import RunsSelect from "../RunsSelect";
import RunSummary from "../RunSummary";
import RunTestSymmary from "../RunTestSummary";


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

export default function TestsReport() {
  const [runTests, setRunTests] = useState<RunTestItens[]>([])
  const [runCondensedData, setRunCondensedData] = useState<RunsCondensedData>()
  const [selectPipelineRuns, setPipelineRuns] = useState<Run[]>([]);

  return (
    <PipelineProvider>
      <AllRunsProvider>
        <Flex direction="column" h="100vh">
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={5} >
                <Flex direction="column"  justify="center">
                  <Box display="flex" mt="1px" bg="white" p={3} gap="5" >
                  <Text mt="1">Runs Report</Text>
                    <PipelineSelect setPipelineRuns={setPipelineRuns} setRunCondensedData={setRunCondensedData} setRunTests={setRunTests}/>
                    {selectPipelineRuns && (
                      <Box display="flex" gap="4" as="form">
                        <RunsSelect
                          runs={selectPipelineRuns}
                          setRunCondensedData={setRunCondensedData}
                          setRunTests={setRunTests}
                        />
                      </Box>
                    )}
                  </Box>
                </Flex>
            </GridItem>
          </Grid>
          {runTests.length > 0 && (
            <>
              <RunSummary runCondensedData={runCondensedData} />
              <RunTestSymmary runTests={runTests} state="Failed" />
              <RunTestSymmary runTests={runTests} state="NotExecuted" />
            </>
          )}
        </Flex>
      </AllRunsProvider>
    </PipelineProvider>

  );
}

// // Decorator Pattern
// export const getServerSideProps = withSession((ctx: any) => {
//   return {
//     props: {
//       session: ctx.req.session,
//     },
//   };
// });
