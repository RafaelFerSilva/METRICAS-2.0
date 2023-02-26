import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
// import { VerticalBar } from "../Charts/ChartVerticalBar";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { LineChart } from "../Charts/ChartLine";

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

interface Pipeline {
    id: string;
    name: string;
    url: string;
}

interface PropsTestReportGraphic {
    data: RunsCondensedData[],
    selectedPipeline: Pipeline,
}

export default function TestReportGraphic({ data, selectedPipeline }: PropsTestReportGraphic) {
    const [returnTime, setReturnTime] = useState<string[]>([])
    const [returnTotal, setReturnTotal] = useState<string[]>([])
    const [seletedLastData, setSeletedLastData] = useState<any>()
    // const lastData = [120, 90, 60, 30, 20, 10, 5]

    const handleChange = async (event: any) => {
        event.preventDefault();
        if (event.target.value !== "") {
            setSeletedLastData(event.target.value)
        } else {
            setSeletedLastData(data.length)
        }
    };

    useEffect(() => {
        let time: string[] = []
        let total: string[] = []

        // let reverse = data.reverse()
        // let newData = reverse.slice((data.length - seletedLastData))
        // console.log(data)
        // console.log(reverse)

        data.map((item) => {
            time.push(new Date(item.completedDate).toLocaleDateString())
            total.push(item.totalTests)
        })

        setReturnTime(time.reverse())
        setReturnTotal(total.reverse())
    }, [data, seletedLastData])

    return (
        <>
            {/* <Flex direction="column" justify="center">
                <Box display="flex" mt="1px" bg="white" p={["6", "8"]} gap="5" >
                    <VStack spacing="8">
                        <SimpleGrid
                            minChildWidth="240px"
                            spacing={["6", "8"]}
                            alignSelf="flex-start"
                        >
                            <VStack spacing={3}>
                                <Select
                                    placeholder="Todas"
                                    size="md"
                                    onChange={(ev) => handleChange(ev)}
                                    value={seletedLastData}
                                >
                                    {lastData.map((lastDays: any, key) => {
                                        return (
                                            <option key={key} value={lastDays}>
                                                Ultimas {lastDays} runs
                                            </option>
                                        );
                                    })}
                                </Select>
                            </VStack>
                        </SimpleGrid>
                    </VStack>
                </Box>
            </Flex> */}
            <Alert status='info' p={["4", "5"]} fontSize="14">
                <AlertIcon />
                <AlertTitle>Dados baseados nos resultados das runs!</AlertTitle>
                <AlertDescription>Os jobs não salvam todas as runs executadas, as runs são salvas por um período pré determinado de tempo.</AlertDescription>
            </Alert>
            <Flex justifyContent="center" mt="10px">
                <Box
                    p={["4", "5"]}
                    bg="Snow"
                    borderRadius={8}
                    pb="4"
                    mb="4"
                    maxWidth="820px"
                    minWidth="720px"
                >
                    <LineChart
                        title={selectedPipeline.name}
                        labels={returnTime}
                        data={returnTotal}
                        label={selectedPipeline.name}
                    />
                </Box>
            </Flex>
        </>
    )
}
