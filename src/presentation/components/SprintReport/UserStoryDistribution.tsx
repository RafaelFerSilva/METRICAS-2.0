import { Box, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { ModernBarChart } from "../ModernBarChart";
import { Task } from "../../../core/shared/types/Task";

interface UserStoryDistributionProps {
    directUserStories: Task[];
    relatedUserStories: Task[];
    directStoryPoints: number;
    relatedStoryPoints: number;
}

export function UserStoryDistribution({
    directUserStories,
    relatedUserStories,
    directStoryPoints,
    relatedStoryPoints
}: UserStoryDistributionProps) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const distributionData = [
        {
            label: `Da Sprint (${directUserStories.length} USs)`,
            value: directStoryPoints,
            color: "blue"
        },
        {
            label: `Relacionadas (${relatedUserStories.length} USs)`,
            value: relatedStoryPoints,
            color: "orange"
        },
    ];

    const totalUSs = directUserStories.length + relatedUserStories.length;
    const totalPoints = directStoryPoints + relatedStoryPoints;

    return (
        <Box
            p={6}
            bg={bgColor}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
        >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
                📊 User Stories: Origem
            </Text>
            <Text fontSize="sm" color="gray.600" mb={4}>
                {totalUSs} user stories totais • {totalPoints} story points
            </Text>
            <ModernBarChart
                data={distributionData}
                title="Distribuição por Origem"
            />
        </Box>
    );
}
