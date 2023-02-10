import { useContext, useEffect, useState } from 'react'
import { Box, Flex, Grid, GridItem, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { Header } from '../Header';
import { AllRunsContext } from '../../contexts/AllRunsContext';
import { tokenService } from '../../services/auth/tokenService';
import { setupAPIMetrics } from '../../services/api';
import { PipelineContext } from '../../contexts/PipelineContext';

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
    const [pipeline, setPepiline] = useState("");
    const [selectedPipeline, setSelectedPipelineItem] = useState<Run[]>([])
    const [data, setData] = useState<any[]>([])
    const [runsDataId, setRunsDataId] = useState<RunsId[]>([])
    const [loading, setLoading] = useState(false);
    const runsItens = useContext(AllRunsContext);

    const pipelines = useContext(PipelineContext);

    const returnSelectPipelineData = (id: string) => {
        let pipelineItem = pipelines.filter(function (pipeline: Pipeline) {
            return (
                pipeline.id == id
            );
        });

        return pipelineItem
    }

    const handleChange = (event: any) => {
        event.preventDefault();
        setPepiline(event.target.value);
        console.log(event.target.value)


        if (event.target.value) {

            const pipelineData = returnSelectPipelineData(event.target.value)
            console.log(pipelineData)

            if (pipelineData.length > 0) {
                const fetchPipelineRunList = async () => {
                    let runsData: Run[] = await axiosInstance
                        .get(
                            `https://dev.azure.com/${organization}/${project_id}/_apis/pipelines/${pipelineData[0].id}/runs?api-version=6.0-preview.1`
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

                                return runs
                            }
                        })

                    setSelectedPipelineItem(runsData)
                }

                fetchPipelineRunList()

                const returnSelectRunsData = (id: string) => {
                    let selectedRunId: RunsId;
                    let selectRuns = runsItens.filter(function (run: any) {
                        return (
                            run.build.id == id
                        );
                    });

                    if (selectRuns.length !== 0) {
                        selectedRunId = {
                            id: selectRuns[0].id,
                        }
                    }

                    return selectedRunId
                }

                let runsDataIdItem: RunsId[] = []
                selectedPipeline.map(async (item) => {
                    let dataId = returnSelectRunsData(item.id)
                    runsDataIdItem.push(dataId)
                })
                console.log(runsDataIdItem)
                setRunsDataId(runsDataIdItem)
            }
        }
    };


    useEffect(() => {
        console.log(pipeline)
        const getData = () => {

            let condensedData: any[] = []


            runsDataId.map((run) => {
                if (run !== undefined) {
                    axiosInstance
                        .get(`https://dev.azure.com/${organization}/Satelital/_apis/test/Runs/${run.id}`)
                        .then((response) => {
                            if (response.status === 200) {
                                condensedData.push(response.data)
                            }
                        }).catch(function (error) {
                            console.log(JSON.stringify(error.message))
                        })
                }
            })

            setData(condensedData);
        }

        setLoading(true)
        getData()
        setLoading(false)


    }, [pipeline, runsDataId])

    if (!loading && <p>Loaging ...</p>)

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
                {/* {console.log(data)} */}
                {data && data.map((item) => <p key={item.id}>{item.name}</p>)}
            </>
        )
}