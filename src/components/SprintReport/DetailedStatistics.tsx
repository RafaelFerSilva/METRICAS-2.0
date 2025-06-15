import { SimpleGrid } from "@chakra-ui/react";
import { ChartCard } from "../ModernCard/SimpleCard";
import { ModernBarChart } from "../ModernBarChart";
import { MdBarChart } from "react-icons/md";
import { Task } from "../../types/Task";


interface DetailedStatisticsProps {
    userStories: Task[];
    bugs: Task[];
    defects: Task[];
    taskItems: Task[];
    totalStoryPoints: number;
}

export function DetailedStatistics({ userStories, bugs, defects, taskItems, totalStoryPoints }: DetailedStatisticsProps) {
    
    const workItemTypesData = [
        { label: "User Story", value: userStories.length, color: "blue" },
        { label: "Bug", value: bugs.length, color: "red" },
        { label: "Defect", value: defects.length, color: "orange" },
        { label: "Story Points", value: totalStoryPoints, color: "yellow" },
        { label: "Task", value: taskItems.length, color: "purple" },
      ];

    return (
        <SimpleGrid
          columns={{ base: 1, lg: 1 }}
          spacing={{ base: 4, md: 8 }}
          w="100%"
        >
          <ChartCard
            title="Distribuição por Tipo de Item"
            subtitle="Todos os tipos de work items"
            icon={MdBarChart}
            colorScheme="blue"
          >
            <ModernBarChart
              data={workItemTypesData}
              title="Work Item Types"
              colorScheme="blue"
            />
          </ChartCard>
        </SimpleGrid>
    )
}