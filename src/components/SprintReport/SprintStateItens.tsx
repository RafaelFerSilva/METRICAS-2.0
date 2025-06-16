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
    problems: Task[];
    taskItems: Task[];
    userStoryStatesData: StateItem[];
    bugStatesData: StateItem[];
    defectStatesData: StateItem[];
    problemsStateData: StateItem[];
    taskStatesData: StateItem[];
}

export default function SprintStateItens({ userStories, bugs, defects, problems, taskItems, userStoryStatesData, bugStatesData, defectStatesData, problemsStateData, taskStatesData }: SprintStateItensProps) {
    return (
        <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 4, md: 8 }}
            w="100%"
        >
            {userStories.length > 0 && (
                <ChartCard
                    title="User Stories por Estado"
                    subtitle={`${userStories.length} user stories no total`}
                    icon={MdShowChart}
                    colorScheme="green"
                >
                    <ModernBarChart
                        data={userStoryStatesData}
                        title="Estados das User Stories"
                    />
                </ChartCard>
            )}


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
                    />
                </ChartCard>
            )}

            {problems.length > 0 && (
                <ChartCard
                    title="Problemas por Estado"
                    subtitle={`${problems.length} problemas identificados`}
                    icon={MdBugReport}
                    colorScheme="red"
                >
                    <ModernBarChart
                        data={problemsStateData}
                        title="Estados dos Defects"
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