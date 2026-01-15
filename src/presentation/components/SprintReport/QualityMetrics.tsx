import { SimpleGrid, Box, Text, Stat, StatLabel, StatNumber, StatHelpText, Icon, useColorModeValue, Tooltip, HStack } from "@chakra-ui/react";
import { MdCheckCircle, MdBugReport, MdWarning, MdInfoOutline } from "react-icons/md";
import { Task } from "../../../core/shared/types/Task";

interface QualityMetricsProps {
    bugs: Task[];
    defects: Task[];
    problems: Task[];
    userStories: Task[];
    totalItems: number;
}

export function QualityMetrics({ bugs, defects, problems, userStories, totalItems }: QualityMetricsProps) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Calculate quality metrics
    const totalQualityIssues = bugs.length + defects.length + problems.length;

    // Issues per User Story
    const bugRate = userStories.length > 0 ? (totalQualityIssues / userStories.length) * 100 : 0;
    const defectDensity = userStories.length > 0 ? (defects.length / userStories.length) : 0;

    // NEW: Sprint Quality - considers ALL issues (regardless of Parent)
    // Measures quality of the sprint as a whole
    const issueRate = totalItems > 0 ? (totalQualityIssues / totalItems) * 100 : 0;
    const sprintQuality = 100 - issueRate; // Invert: more issues = lower quality

    // Color coding based on thresholds
    const getBugRateColor = () => {
        if (bugRate < 50) return "green";     // < 0.5 issues per US
        if (bugRate < 100) return "yellow";   // 0.5-1 issue per US  
        return "red";                         // > 1 issue per US
    };

    const getSprintQualityColor = () => {
        if (totalQualityIssues === 0) return "green";      // Perfect: zero issues
        if (issueRate < 10) return "yellow";               // Good: < 10% issues
        return "red";                                      // Poor: >= 10% issues
    };

    return (
        <Box
            p={6}
            bg={bgColor}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
        >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                📊 Métricas de Qualidade
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Stat>
                    <HStack spacing={2} mb={2}>
                        <StatLabel fontSize="sm" color="gray.600">Issues por User Story</StatLabel>
                        <Tooltip
                            label="Mede a densidade de issues (bugs + defects + problems) por User Story. Quanto menor, melhor a qualidade do código."
                            placement="top"
                            hasArrow
                        >
                            <span><Icon as={MdInfoOutline} color="gray.400" boxSize={4} cursor="help" /></span>
                        </Tooltip>
                    </HStack>
                    <StatNumber fontSize="2xl" color={`${getBugRateColor()}.500`}>
                        {(bugRate / 100).toFixed(2)}
                    </StatNumber>
                    <StatHelpText>
                        <Icon as={MdBugReport} mr={1} />
                        {totalQualityIssues} issues / {userStories.length} USs
                    </StatHelpText>
                </Stat>

                <Stat>
                    <HStack spacing={2} mb={2}>
                        <StatLabel fontSize="sm" color="gray.600">Defect Density</StatLabel>
                        <Tooltip
                            label="Número médio de defeitos por User Story. Métrica clássica de qualidade de software. Ideal: < 0.5"
                            placement="top"
                            hasArrow
                        >
                            <span><Icon as={MdInfoOutline} color="gray.400" boxSize={4} cursor="help" /></span>
                        </Tooltip>
                    </HStack>
                    <StatNumber fontSize="2xl">
                        {defectDensity.toFixed(2)}
                    </StatNumber>
                    <StatHelpText>
                        <Icon as={MdWarning} mr={1} />
                        defects por User Story
                    </StatHelpText>
                </Stat>

                <Stat>
                    <HStack spacing={2} mb={2}>
                        <StatLabel fontSize="sm" color="gray.600">Qualidade da Sprint</StatLabel>
                        <Tooltip
                            label="Percentual de qualidade da sprint baseado na quantidade de issues. Considera TODAS as issues (com ou sem Parent). Verde = 0 issues, Amarelo < 10%, Vermelho ≥ 10%."
                            placement="top"
                            hasArrow
                        >
                            <span><Icon as={MdInfoOutline} color="gray.400" boxSize={4} cursor="help" /></span>
                        </Tooltip>
                    </HStack>
                    <StatNumber fontSize="2xl" color={`${getSprintQualityColor()}.500`}>
                        {sprintQuality.toFixed(1)}%
                    </StatNumber>
                    <StatHelpText>
                        <Icon as={MdCheckCircle} mr={1} />
                        {totalQualityIssues === 0 ? "Perfeito!" : `${totalQualityIssues} issues de ${totalItems} itens`}
                    </StatHelpText>
                </Stat>
            </SimpleGrid>
        </Box>
    );
}
