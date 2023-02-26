import { useContext, useEffect, useState, useMemo } from 'react'
import { Box, Center, Flex, Grid, GridItem, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { Header } from '../Header';
import { AllRunsContext } from '../../contexts/AllRunsContext';
import { tokenService } from '../../services/auth/tokenService';
import { setupAPIMetrics } from '../../services/api';
import { PipelineContext } from '../../contexts/PipelineContext';
import TestReportGraphic from '../TestReportGraphic';
import Loading from '../Loading';

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

interface Run {
    id: string;
    name: string;
    url: string;
    finishedDate: string;
    createdDate: string;
    result: string;
    state: string;
}

interface RunsId {
    id: string;
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function TestGraphic() {
    const [pipeline, setPepiline] = useState();
    const [selectedPipeline, setSelectedPipeline] = useState<Pipeline>()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([])
    const runsItens = useContext(AllRunsContext);
    const pipelines = useContext(PipelineContext);

    const handleChange = async (event: any) => {
        event.preventDefault();
        setData([])
        let emptyPipeline: Pipeline = {
            id: "",
            name: "",
            url: ""
        }
        setSelectedPipeline(emptyPipeline)
        setPepiline(event.target.value)

    };

    const fechData = async (runsPipeData: RunsId[]) => {
        let returnItem = runsPipeData.map(async (run: { id: string; }) => {
            if (run !== undefined) {
                let item: RunsCondensedData = await axiosInstance
                    .get(`https://dev.azure.com/${organization}/Satelital/_apis/test/Runs/${run.id}`)
                    .then((response) => {
                        if (response.status === 200) {
                            return {
                                id: response.data.id,
                                name: response.data.name,
                                startedDate: response.data.startedDate,
                                completedDate: response.data.completedDate,
                                state: response.data.state,
                                build: response.data.build,
                                pipelineId: response.data.pipelineId,
                                totalTests: response.data.totalTests,
                                passedTests: response.data.passedTests,
                                incompleteTests: response.data.incompleteTests,
                                unanalyzedTests: response.data.unanalyzedTests,
                                notApplicableTests: response.data.notApplicableTests,
                                postProcessState: response.data.postProcessState,
                                url: response.data.url
                            }
                        }
                    })
                return item
            }
        })
        return Promise.all(returnItem)
    }


    useEffect(() => {
        const returnSelectPipelineData = (id: string) => {
            let pipelineItem = pipelines.filter((pipeline: Pipeline) => pipeline.id == id)
            return pipelineItem[0]
        }

        const returnSelectRunsData = async (id: string): Promise<RunsId> => {
            let selectedRunId: RunsId;
            let selectRuns = runsItens.filter((run: any) => run.build.id == id);

            if (selectRuns.length !== 0) {
                selectedRunId = {
                    id: selectRuns[0].id,
                }
            }

            if (selectedRunId !== undefined) {
                return selectedRunId
            }
        }


        const fetchPipeline = async (pipelineData: Pipeline) => {
            let runsData: Run[] = await axiosInstance
                .get(
                    `https://dev.azure.com/${organization}/${project_id}/_apis/pipelines/${pipelineData.id}/runs?api-version=6.0-preview.1`
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
                    }
                    return runs
                })

            let runsDataIdItem: RunsId[] = []
            runsData.map(async (item) => {
                let dataId = await returnSelectRunsData(item.id)
                runsDataIdItem.push(dataId)
            })

            return runsDataIdItem
        }


        if (pipeline !== "") {
            const pipelineData = returnSelectPipelineData(pipeline)
            setSelectedPipeline(pipelineData)

            if (pipelineData !== undefined) {
                void async function () {
                    setIsLoading(true)
                    let runsPipeData = await fetchPipeline(pipelineData)
                    let items = await fechData(runsPipeData)
                    let item = items.filter((itemFilter) => itemFilter !== undefined)
                    setData(item)
                    setIsLoading(false)
                }()
            } else {
                setData([])
            }
        }

    }, [pipeline, pipelines, runsItens])

    const renderGraphic = () => {
        if (data.length > 0) {
            return < TestReportGraphic data={data} selectedPipeline={selectedPipeline} />
        }
    }

    return (
        <>
            <Grid templateColumns="repeat(5, 1fr)">
                <GridItem colSpan={5}>
                    <Header />
                </GridItem>
                <GridItem colSpan={5} >
                    <Flex direction="column" justify="center">
                        <Box display="flex" mt="1px" bg="white" p={["6", "8"]} gap="5" >
                            <VStack spacing="8">
                                <SimpleGrid
                                    minChildWidth="240px"
                                    spacing={["6", "8"]}
                                    alignSelf="flex-start"
                                >
                                    <VStack spacing={3}>
                                        <Select
                                            placeholder="Pipelines"
                                            size="lg"
                                            onChange={(ev) => handleChange(ev)}
                                            value={pipeline}
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
                        </Box>
                    </Flex>
                </GridItem>
            </Grid>
            {isLoading ? <Center height="100%" mt="20px">< Loading color='blue' type='spin' /></Center> : renderGraphic()}
        </>
    )
}