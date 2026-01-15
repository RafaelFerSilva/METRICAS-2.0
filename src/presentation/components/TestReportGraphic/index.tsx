import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
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
    )
}
