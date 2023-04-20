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

interface TestType {
    id: string;
    name: string
}

interface PropsTestReportGraphic {
    data: RunsCondensedData[],
    item_name: TestType
}

export default function TestReportGraphic({ data, item_name }: PropsTestReportGraphic) {
    const [returnTime, setReturnTime] = useState<string[]>([])
    const [returnTotal, setReturnTotal] = useState<string[]>([])

    useEffect(() => {
        let time: string[] = []
        let total: string[] = []

        data.map((item) => {
            time.push(new Date(item.completedDate).toLocaleDateString())
            total.push(item[item_name.id])
        })

        setReturnTime(time.reverse())
        setReturnTotal(total.reverse())
    }, [data, item_name])

    return (
        <>
            {/* <Alert status='info' p={["4", "5"]} fontSize="14">
                <AlertIcon />
                <AlertTitle>Dados baseados nos resultados das runs!</AlertTitle>
                <AlertDescription>Os jobs não salvam todas as runs executadas, as runs são salvas por um período pré determinado de tempo.</AlertDescription>
            </Alert> */}
            <Flex justifyContent="center" mt="10px" ml="50px">
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
                        title={item_name.name}
                        labels={returnTime}
                        data={returnTotal}
                        label={item_name.name}
                    />
                </Box>
            </Flex>
        </>
    )
}
