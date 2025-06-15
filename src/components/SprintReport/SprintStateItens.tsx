import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Box, useColorModeValue } from "@chakra-ui/react";
import { MdShowChart, MdBugReport, MdAssignment, MdTrendingUp } from "react-icons/md";
import { ModernBarChart } from "../ModernBarChart";
import { ChartCard } from "../ModernCard/SimpleCard";
import { Task } from "../../types/Task";

interface StateItem {
    label: string;
    value: number;
    color: string;
}

interface SprintStateItensProps {
    userStories: Task[];
    bugs: Task[];
    defects: Task[];
    taskItems: Task[];
    userStoryStatesData: StateItem[];
    bugStatesData: StateItem[];
    defectStatesData: StateItem[];
    taskStatesData: StateItem[];
}

export default function SprintStateItens({ userStories, bugs, defects, taskItems, userStoryStatesData, bugStatesData, defectStatesData, taskStatesData }: SprintStateItensProps) {
    return (
        <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 4, md: 8 }}
            w="100%"
        >
            <ChartCard
                title="User Stories por Estado"
                subtitle={`${userStories.length} user stories no total`}
                icon={MdShowChart}
                colorScheme="green"
            >
                <ModernBarChart
                    data={userStoryStatesData}
                    title="Estados das User Stories"
                    colorScheme="green"
                />
            </ChartCard>

            {bugs.length > 0 && (
                <ChartCard
                    title="Bugs por Estado"
                    subtitle={`${bugs.length} bugs identificados`}
                    icon={MdBugReport}
                    colorScheme="red"
                >
                    <ModernBarChart
                        data={bugStatesData}
                        title="Estados dos Bugs"
                        colorScheme="red"
                    />
                </ChartCard>
            )}

            {defects.length > 0 && (
                <ChartCard
                    title="Defects por Estado"
                    subtitle={`${defects.length} defects identificados`}
                    icon={MdBugReport}
                    colorScheme="red"
                >
                    <ModernBarChart
                        data={defectStatesData}
                        title="Estados dos Defects"
                        colorScheme="red"
                    />
                </ChartCard>
            )}

            {/* {taskItems.length > 0 && (
                <ChartCard
                    title="Tasks por Estado"
                    subtitle={`${taskItems.length} tasks no sprint`}
                    icon={MdAssignment}
                    colorScheme="purple"
                >
                    <ModernBarChart
                        data={taskStatesData}
                        title="Estados das Tasks"
                        colorScheme="purple"
                    />
                </ChartCard>
            )} */}
        </SimpleGrid>
    )
}