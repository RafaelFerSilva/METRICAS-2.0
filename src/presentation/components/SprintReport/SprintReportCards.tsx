import { SimpleGrid } from "@chakra-ui/react";
import { MdCheckCircle, MdBugReport, MdTrendingUp, MdAssignment } from "react-icons/md";
import { MetricCard } from "../ModernCard/SimpleCard";
import { Task } from "../../../core/shared/types/Task";


interface SprintReportCardsProps {
    userStories: Task[];
    bugs: Task[];
    defects: Task[];
    problems: Task[];
    totalStoryPoints: number;
    completedStoryPoints: number;
    tasks: Task[];
}

export default function SprintReportCards({ userStories, bugs, defects, problems, totalStoryPoints, completedStoryPoints, tasks }: SprintReportCardsProps) {
    return (
        <SimpleGrid
            columns={{ base: 1, sm: 2, md: 4 }}
            spacing={{ base: 4, md: 6 }}
            w="100%"
        >
            <MetricCard
                title="User Stories"
                value={userStories.length}
                change={`${userStories.filter(us => us.State === "Closed").length} concluídas`}
                changeType="increase"
                icon={MdCheckCircle}
                colorScheme="green"
            />
            <MetricCard
                title="Bugs"
                value={bugs.length}
                change={`${bugs.filter(bug => bug.State !== "Closed").length} em aberto`}
                changeType="decrease"
                icon={MdBugReport}
                colorScheme="red"
            />
            <MetricCard
                title="Defeitos"
                value={defects.length}
                change={`${defects.filter(defect => defect.State !== "Closed").length} em aberto`}
                changeType="decrease"
                icon={MdBugReport}
                colorScheme="orange"
            />
            <MetricCard
                title="Problemas"
                value={problems.length}
                change={`${problems.filter(problem => problem.State !== "Closed").length} em aberto`}
                changeType="decrease"
                icon={MdBugReport}
                colorScheme="yellow"
            />
            <MetricCard
                title="Story Points"
                value={completedStoryPoints}
                change={`de ${totalStoryPoints} pontos`}
                icon={MdTrendingUp}
                colorScheme="purple"
            />
            {/* <MetricCard
                    title="Total de Itens"
                    value={tasks.length}
                    change={`${tasks.filter(tas => tas.State === "Closed").length} concluídos`}
                    icon={MdAssignment}
                    colorScheme="blue"
                /> */}
        </SimpleGrid>
    )
}