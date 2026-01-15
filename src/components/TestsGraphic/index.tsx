import { useContext, useState, useMemo } from 'react'
import { Box, Center, Flex, Grid, GridItem, Select, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { PipelineContext } from '../../contexts/PipelineContext';
import TestReportGraphic from '../TestReportGraphic';
import Loading from '../Loading';
import { usePipelineRuns } from '../../presentation/hooks/usePipelineRuns';
import { useTestRuns } from '../../presentation/hooks/useTestRuns';

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
    url: string;
}

interface TestType {
    id: string;
    name: string
}

export default function TestGraphic() {
    const [selectedPipelineId, setSelectedPipelineId] = useState("");
    const pipelines = useContext(PipelineContext);

    // Fetch Pipeline Runs
    // Only fetch if pipeline selected
    const { data: pipelineRuns, isLoading: isLoadingPipelineRuns } = usePipelineRuns(selectedPipelineId || "");

    // Prepare Build IDs for bulk fetch
    const buildIds = useMemo(() => {
        if (!pipelineRuns || pipelineRuns.length === 0) return undefined;
        // Take top 50 to avoid URL length issues?
        return pipelineRuns.slice(0, 50).map(r => r.id).join(',');
    }, [pipelineRuns]);

    // Fetch Test Runs (Bulk)
    // Enabled only if we have buildIds
    const { data: testRuns, isLoading: isLoadingTestRuns } = useTestRuns(true, true, buildIds);

    const data: RunsCondensedData[] = useMemo(() => {
        if (!testRuns) return [];

        // Use a Set for mapped buildIds if needed, or just map response.
        return testRuns.map(run => ({
            id: run.id,
            name: run.name,
            startedDate: run.createdDate,
            completedDate: run.finishedDate,
            state: run.state,
            build: run.buildId,
            pipelineId: "0", // Not critical for chart
            totalTests: (run.totalTests || 0).toString(),
            passedTests: (run.passedTests || 0).toString(),
            incompleteTests: (run.incompleteTests || 0).toString(),
            unanalyzedTests: (run.unanalyzedTests || 0).toString(),
            notApplicableTests: (run.notApplicableTests || 0).toString(),
            postProcessState: "",
            url: run.url
        }));
    }, [testRuns]);

    const isLoading = (!!selectedPipelineId && isLoadingPipelineRuns) || (!!buildIds && isLoadingTestRuns);

    const handleChange = (event: any) => {
        event.preventDefault();
        setSelectedPipelineId(event.target.value);
    };

    const renderGraphic = () => {
        if (data.length > 0) {
            const totalTests: TestType = { id: 'totalTests', name: 'Total' }
            const passedTests: TestType = { id: 'passedTests', name: 'Passed' }
            const unanalyzedTests: TestType = { id: 'unanalyzedTests', name: 'Failed' }
            const notApplicableTests: TestType = { id: 'notApplicableTests', name: 'Skipped' }

            const renderItem = (
                <Box width="100%">
                    < TestReportGraphic data={data} item_name={totalTests} />
                    < TestReportGraphic data={data} item_name={passedTests} />
                    < TestReportGraphic data={data} item_name={unanalyzedTests} />
                    < TestReportGraphic data={data} item_name={notApplicableTests} />
                </Box>
            )
            return renderItem
        }
        return null; // Return null if no data
    }

    return (
        <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={5} >
                <Flex direction="column" justify="center">
                    <Box display="flex" mt="1px" bg="white" p={3} gap="5" >
                        <Text mt="1">Tests Graphics</Text>
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
                                        value={selectedPipelineId}
                                    >
                                        {pipelines && pipelines.map((pipeline: Pipeline) => {
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
                    </Box>
                </Flex>
            </GridItem>
            {isLoading ? <Center mt="100%" height="100%">< Loading color='blue' type='spin' /></Center> : renderGraphic()}
        </Grid>
    )
}
