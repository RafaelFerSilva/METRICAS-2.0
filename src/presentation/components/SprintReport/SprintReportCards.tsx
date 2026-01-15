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
    // Calculate performance percentages for color coding
    const storyPointsRate = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;
    const usCompletionRate = userStories.length > 0 ? (userStories.filter(us => us.State === "Closed").length / userStories.length) * 100 : 0;

    // Color coding based on thresholds
    const getStoryPointsColor = () => {
        if (storyPointsRate >= 80) return "green";
        if (storyPointsRate >= 60) return "purple";
        return "yellow";
    };

    const getUSColor = () => {
        if (usCompletionRate >= 80) return "green";
        if (usCompletionRate >= 60) return "blue";
        return "yellow";
    };

    const getBugsColor = () => {
        const openBugs = bugs.filter(bug => bug.State !== "Closed").length;
        if (openBugs === 0) return "green";
        if (openBugs <= 2) return "yellow";
        return "red";
    };

    return (
        <SimpleGrid
            columns={{ base: 1, sm: 2, md: 4 }}
            spacing={{ base: 4, md: 6 }}
            w="100%"
        >
            <MetricCard
                title="Story Points"
                value={completedStoryPoints}
                change={`de ${totalStoryPoints} pontos (${storyPointsRate.toFixed(0)}%)`}
                icon={MdTrendingUp}
                colorScheme={getStoryPointsColor()}
                tooltipText="Story Points completos vs total. Métrica principal de progresso da sprint. Verde ≥ 80%, Roxo ≥ 60%, Amarelo < 60%."
            />
            <MetricCard
                title="User Stories"
                value={userStories.length}
                change={`${userStories.filter(us => us.State === "Closed").length} concluídas (${usCompletionRate.toFixed(0)}%)`}
                changeType="increase"
                icon={MdCheckCircle}
                colorScheme={getUSColor()}
                tooltipText="Total de User Stories na sprint e % concluídas. Verde ≥ 80%, Azul ≥ 60%, Amarelo < 60%."
            />
            <MetricCard
                title="Bugs"
                value={bugs.length}
                change={`${bugs.filter(bug => bug.State !== "Closed").length} em aberto`}
                changeType={bugs.filter(bug => bug.State !== "Closed").length > 0 ? "decrease" : "increase"}
                icon={MdBugReport}
                colorScheme={getBugsColor()}
                tooltipText="Total de bugs e quantidade em aberto. Verde = 0 abertos, Amarelo ≤ 2 abertos, Vermelho > 2 abertos."
            />
            <MetricCard
                title="Defeitos + Problemas"
                value={defects.length + problems.length}
                change={`${defects.filter(d => d.State !== "Closed").length + problems.filter(p => p.State !== "Closed").length} em aberto`}
                changeType="decrease"
                icon={MdBugReport}
                colorScheme="orange"
                tooltipText="Soma de defeitos e problemas identificados, com total de itens ainda em aberto."
            />
        </SimpleGrid>
    )
}
