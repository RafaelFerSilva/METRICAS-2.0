import React from 'react';
import { SimpleGrid, Box, Text, Flex, Icon, Tooltip, Progress } from "@chakra-ui/react";
import { MdCheckCircle, MdWarning, MdScience, MdSpeed } from "react-icons/md";

interface KpiCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: any;
    color: string;
    tip?: string;
    progress?: number;
}

const KpiCard = ({ title, value, subValue, icon, color, tip, progress }: KpiCardProps) => (
    <Box p={5} bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justifyContent="space-between" alignItems="start" mb={2}>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">{title}</Text>
            {tip && (
                <Tooltip label={tip} placement="top" hasArrow>
                    <span><Icon as={icon} color={`${color}.500`} boxSize={5} /></span>
                </Tooltip>
            )}
            {!tip && <Icon as={icon} color={`${color}.500`} boxSize={5} />}
        </Flex>
        <Flex alignItems="baseline" gap={2} mb={2}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">{value}</Text>
            {subValue && <Text fontSize="xs" color={`${color}.600`} fontWeight="bold">{subValue}</Text>}
        </Flex>

        {progress !== undefined && (
            <Box mt={2}>
                <Flex justify="space-between" mb={1}>
                    <Text fontSize="xs" color="gray.500">Cobertura</Text>
                    <Text fontSize="xs" fontWeight="bold" color={`${color}.600`}>{progress}%</Text>
                </Flex>
                <Progress value={progress} size="xs" colorScheme={color} borderRadius="full" />
            </Box>
        )}
    </Box>
);

interface TestKpiCardsProps {
    total: number;
    automated: number;
    smokeCount: number;
    highRiskCount: number;
}

export const TestKpiCards = ({ total, automated, smokeCount, highRiskCount }: TestKpiCardsProps) => {
    const automatedPercent = total > 0 ? ((automated / total) * 100).toFixed(1) : "0";
    const manualPercent = total > 0 ? (((total - automated) / total) * 100).toFixed(1) : "0";
    const smokePercent = total > 0 ? ((smokeCount / total) * 100).toFixed(1) : "0";

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="100%">
            <KpiCard
                title="Total Test Cases"
                value={total}
                subValue="Cenários Documentados"
                icon={MdScience}
                color="blue"
                tip="Total de casos de teste no projeto"
            />
            <KpiCard
                title="Automação"
                value={automated}
                subValue={`${automatedPercent}% Automatizado`}
                icon={MdCheckCircle}
                color="green"
                progress={Number(automatedPercent)}
                tip="Cenários que possuem script de automação vinculado"
            />
            <KpiCard
                title="Smoke Test"
                value={smokeCount}
                subValue={`${smokePercent}% do Total`}
                icon={MdSpeed}
                color="purple"
                tip="Testes críticos rápidos para validação de build"
            />
            <KpiCard
                title="Alto Risco"
                value={highRiskCount}
                subValue="Prioridade Alta"
                icon={MdWarning}
                color="orange"
                tip="Testes mapeados como Risco Alto (Core Business)"
            />
        </SimpleGrid>
    );
};
