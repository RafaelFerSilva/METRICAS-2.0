import {
    Box,
    useToast,
    SimpleGrid,
    Center,
    Spinner,
    Text,
    Input,
    Button,
    HStack,
    VStack,
    Heading,
    Divider,
    Alert,
    AlertIcon
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import Chart from "../Chart";
import SearchableSelect from "../SearchableSelect";
import { useSprintComparison } from "../../hooks/useSprintComparison";
import { SprintComparisonDTO } from "../../../core/application/dtos/sprint-comparison.dto";
import { Sprint } from "../../../core/domain/entities/sprint.entity";
import { KpiCard } from "./KpiCard";

interface Team {
    id: string;
    name: string;
}

interface CompareSprintsProps {
    sprintTeam: Team;
    sprint: Sprint[]; // Usage of Domain Entity
}

// Data accumulator structure
interface CondensedSprintsData {
    name: string[];
    points: number[];
    pointsDelivery: number[];
    pointsNotDelivered: number[];
    cycleTime: number[];
    cycleTimeP95: number[];
    cycleTimeUCL: number[];
    leadTime: number[];
    leadTimeP95: number[];
    leadTimeUCL: number[];
    userStories: number[];
    bugs: number[];
    defects: number[];

    // Calculated Averages for KPIs
    avgVelocity: number;
    avgCycle: number;
    avgLead: number;
    avgDeliveryRate: number;
}

const truncateLabel = (label: string, maxLength = 20) => {
    if (label.length <= maxLength) return label;
    return `${label.substring(0, maxLength)}...`;
};

export default function CompareSprints({ sprint, sprintTeam }: CompareSprintsProps) {
    const [condensedSprintsData, setCondensedSprintsData] = useState<CondensedSprintsData>();
    const [maxItems, setMaxItems] = useState("6"); // Default increased to 6 to show trends better
    const [tagsFilterInput, setTagsFilterInput] = useState("");
    const [tagsFilter, setTagsFilter] = useState<string[]>([]);
    const toast = useToast();

    const { fetchComparison, isLoading } = useSprintComparison();

    const loadSprintData = useCallback(async () => {
        if (!sprint || sprint.length === 0) return;

        try {
            const filters = tagsFilter.length > 0 ? { tags: tagsFilter } : undefined;
            const summaryData = await fetchComparison({ teamId: sprintTeam.id, sprints: sprint, filters });

            // Helper to get array from data
            const extractSprintData = (data: SprintComparisonDTO[], key: keyof SprintComparisonDTO) => {
                return data.map((item) => item ? Number(item[key]) || 0 : 0);
            };

            const slicedData = summaryData.slice(-Number(maxItems));

            // Calculate Averages based on SLICED (visible) data
            const totalPointsPlanned = extractSprintData(slicedData, "points").reduce((a, b) => a + b, 0);
            const totalPointsDelivered = extractSprintData(slicedData, "pointsDelivery").reduce((a, b) => a + b, 0);
            const avgVelocity = Number((totalPointsDelivered / slicedData.length).toFixed(1));
            const avgDeliveryRate = totalPointsPlanned > 0 ? Number(((totalPointsDelivered / totalPointsPlanned) * 100).toFixed(1)) : 0;

            const validCycle = extractSprintData(slicedData, "avgCycleTime").filter(v => v > 0);
            const avgCycle = validCycle.length > 0 ? Number((validCycle.reduce((a, b) => a + b, 0) / validCycle.length).toFixed(1)) : 0;

            const validLead = extractSprintData(slicedData, "avgLeadTime").filter(v => v > 0);
            const avgLead = validLead.length > 0 ? Number((validLead.reduce((a, b) => a + b, 0) / validLead.length).toFixed(1)) : 0;

            const condensed: CondensedSprintsData = {
                name: summaryData.map(item => item.name).slice(-Number(maxItems)),
                points: extractSprintData(summaryData, "points").slice(-Number(maxItems)),
                pointsDelivery: extractSprintData(summaryData, "pointsDelivery").slice(-Number(maxItems)),
                pointsNotDelivered: extractSprintData(summaryData, "pointsNotDelivered").slice(-Number(maxItems)),

                cycleTime: extractSprintData(summaryData, "avgCycleTime").slice(-Number(maxItems)),
                cycleTimeP95: extractSprintData(summaryData, "cycleTimeP95").slice(-Number(maxItems)),
                cycleTimeUCL: extractSprintData(summaryData, "cycleTimeUCL").slice(-Number(maxItems)),

                leadTime: extractSprintData(summaryData, "avgLeadTime").slice(-Number(maxItems)),
                leadTimeP95: extractSprintData(summaryData, "leadTimeP95").slice(-Number(maxItems)),
                leadTimeUCL: extractSprintData(summaryData, "leadTimeUCL").slice(-Number(maxItems)),

                userStories: extractSprintData(summaryData, "userStories").slice(-Number(maxItems)),
                bugs: extractSprintData(summaryData, "bugs").slice(-Number(maxItems)),
                defects: extractSprintData(summaryData, "defects").slice(-Number(maxItems)),

                avgVelocity,
                avgCycle,
                avgLead,
                avgDeliveryRate
            };

            setCondensedSprintsData(condensed);
        } catch (error) {
            toast({
                title: "Erro ao carregar dados.",
                description: "Não foi possível carregar o comparativo de sprints.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [sprint, sprintTeam.id, toast, maxItems, fetchComparison, tagsFilter]);

    useEffect(() => {
        void loadSprintData();
    }, [loadSprintData]);


    if (isLoading) {
        return (
            <Center h="200px">
                <Spinner size="xl" color="blue.500" />
            </Center>
        );
    }

    if (!condensedSprintsData) {
        return (
            <Alert status="info" borderRadius="md">
                <AlertIcon />
                Selecione sprints para visualizar o comparativo.
            </Alert>
        );
    }

    // Benchmark Calculations for Charts
    const cycleBenchmarkData = Array(condensedSprintsData.cycleTime.length).fill(condensedSprintsData.avgCycle);
    const leadBenchmarkData = Array(condensedSprintsData.leadTime.length).fill(condensedSprintsData.avgLead);

    return (
        <Box w="100%" p={2}>
            {/* Header & Filters */}
            <Box bg="white" p={4} borderRadius="lg" shadow="sm" mb={6}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} alignItems="end">
                    <Box>
                        <Heading size="md" mb={1}>Sprint Analytics</Heading>
                        <Text color="gray.500" fontSize="sm">Comparativo e tendências de performance</Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500" textTransform="uppercase">
                            Período (Sprints)
                        </Text>
                        <SearchableSelect
                            options={[{ value: "4", label: "Últimas 4" }, { value: "6", label: "Últimas 6" }, { value: "8", label: "Últimas 8" }, { value: "12", label: "Últimas 12" }]}
                            value={maxItems}
                            onChange={(selectedOption: string) => setMaxItems(selectedOption)}
                            placeholder="Selecione"
                        />
                    </Box>
                    <Box>
                        <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500" textTransform="uppercase">
                            Filtrar por Tags
                        </Text>
                        <HStack>
                            <Input
                                placeholder="Ex: Expedite, Bug..."
                                value={tagsFilterInput}
                                onChange={(e) => setTagsFilterInput(e.target.value)}
                                size="sm"
                            />
                            <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={() => {
                                    const tags = tagsFilterInput.split(",").map(t => t.trim()).filter(t => t.length > 0);
                                    setTagsFilter(tags);
                                }}
                            >
                                Filtrar
                            </Button>
                            {tagsFilter.length > 0 && (
                                <Button
                                    variant="ghost" colorScheme="red" size="sm"
                                    onClick={() => { setTagsFilterInput(""); setTagsFilter([]); }}
                                >
                                    Limpar
                                </Button>
                            )}
                        </HStack>
                    </Box>
                </SimpleGrid>
                {tagsFilter.length > 0 && (
                    <Text fontSize="xs" color="blue.500" mt={2} fontWeight="bold">
                        Filtro Ativo: {tagsFilter.join(", ")}
                    </Text>
                )}
            </Box>

            {/* KPI Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
                <KpiCard
                    label="Velocidade Média"
                    value={`${condensedSprintsData.avgVelocity} pts`}
                    tooltip="Média de Story Points entregues nas sprints selecionadas."
                    color="green.400"
                />
                <KpiCard
                    label="Taxa de Entrega"
                    value={`${condensedSprintsData.avgDeliveryRate}%`}
                    tooltip="% de pontos planejados que foram efetivamente entregues."
                    color={condensedSprintsData.avgDeliveryRate >= 80 ? "green.400" : "orange.400"}
                />
                <KpiCard
                    label="Avg Cycle Time"
                    value={`${condensedSprintsData.avgCycle}d`}
                    subValue={`Benchmark: ${condensedSprintsData.avgCycle}d`}
                    tooltip="Tempo médio que um item leva de 'In Progress' até 'Closed'."
                    color="blue.400"
                />
                <KpiCard
                    label="Avg Lead Time"
                    value={`${condensedSprintsData.avgLead}d`}
                    tooltip="Tempo médio desde a criação (Backlog) até a entrega."
                    color="purple.400"
                />
            </SimpleGrid>

            {/* Section 1: Process Efficiency (Cycle & Lead Time Charts) */}
            <Box mb={8}>
                <Divider mb={4} />
                <Heading size="sm" mb={4} color="gray.600">Eficiência de Fluxo & Estabilidade</Heading>
                <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={8}>
                    <Chart
                        data={{
                            datasets: [
                                { data: condensedSprintsData.cycleTime, label: 'Cycle Time (Avg)', borderColor: '#3182CE', backgroundColor: '#3182CE', tension: 0.3, pointRadius: 4 },
                                { data: condensedSprintsData.cycleTimeP95, label: 'P95 (Risco)', borderColor: '#DD6B20', borderDash: [5, 5], backgroundColor: 'transparent', pointRadius: 0, borderWidth: 1.5 },
                                { data: condensedSprintsData.cycleTimeUCL, label: 'UCL (Limite)', borderColor: '#E53E3E', backgroundColor: 'transparent', pointStyle: 'rect', borderWidth: 1, pointRadius: 0 },
                                { data: cycleBenchmarkData, label: 'Benchmarks', borderColor: '#718096', borderDash: [2, 2], pointRadius: 0, borderWidth: 1, backgroundColor: 'transparent' }
                            ],
                            labels: condensedSprintsData.name.map(label => truncateLabel(label))
                        }}
                        title="Cycle Time: Trend"
                        tip="Cycle Time é o tempo de trabalho ativo. A linha laranja (P95) mostra que 95% dos itens são entregues neste prazo. Pontos acima da linha vermelha (UCL) são anomalias que desviaram do padrão do processo."
                        type="line"
                        multiColor={false}
                    />
                    <Chart
                        data={{
                            datasets: [
                                { data: condensedSprintsData.leadTime, label: 'Lead Time (Avg)', borderColor: '#805AD5', backgroundColor: '#805AD5', tension: 0.3, pointRadius: 4 },
                                { data: condensedSprintsData.leadTimeP95, label: 'P95 (Risco)', borderColor: '#DD6B20', borderDash: [5, 5], backgroundColor: 'transparent', pointRadius: 0, borderWidth: 1.5 },
                                { data: condensedSprintsData.leadTimeUCL, label: 'UCL (Limite)', borderColor: '#E53E3E', backgroundColor: 'transparent', pointStyle: 'rect', borderWidth: 1, pointRadius: 0 },
                                { data: leadBenchmarkData, label: 'Benchmarks', borderColor: '#718096', borderDash: [2, 2], pointRadius: 0, borderWidth: 1, backgroundColor: 'transparent' }
                            ],
                            labels: condensedSprintsData.name.map(label => truncateLabel(label))
                        }}
                        title="Lead Time: Trend"
                        tip="Lead Time é o tempo total desde a criação até a entrega. Inclui filas de espera. Se o Lead Time sobe enquanto o Cycle Time mantém-se estável, indica gargalos no backlog ou aprovações."
                        type="line"
                        multiColor={false}
                    />
                </SimpleGrid>
            </Box>

            {/* Section 2: Delivery & Work Distribution */}
            <Box mb={8}>
                <Divider mb={4} />
                <Heading size="sm" mb={4} color="gray.600">Entregas & Distribuição de Trabalho</Heading>
                <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={8}>
                    {/* Velocity Chart: Planned vs Delivered */}
                    <Chart
                        data={{
                            datasets: [
                                { data: condensedSprintsData.pointsDelivery, label: 'Entregue', backgroundColor: '#48BB78' },
                                { data: condensedSprintsData.pointsNotDelivered, label: 'Não Entregue', backgroundColor: '#FED7D7' }
                            ],
                            labels: condensedSprintsData.name.map(label => truncateLabel(label))
                        }}
                        title="Velocity Trend (Pontos)"
                        tip="Comparativo entre o que foi planejado vs entregue. Barras vermelhas altas indicam problemas constantes de planejamento ou bloqueios externos."
                        type="bar-vertical"
                        stacked={true}
                    />

                    {/* Work Item Type Distribution */}
                    <Chart
                        data={{
                            datasets: [
                                { data: condensedSprintsData.userStories, label: 'Stories', backgroundColor: '#4299E1' },
                                { data: condensedSprintsData.bugs, label: 'Bugs', backgroundColor: '#F56565' },
                                { data: condensedSprintsData.defects, label: 'Defects', backgroundColor: '#ECC94B' }
                            ],
                            labels: condensedSprintsData.name.map(label => truncateLabel(label))
                        }}
                        title="Throughput Profile"
                        tip="Distribuição dos tipos de trabalho entregues. Uma proporção saudável depende do contexto, mas excesso de Bugs pode indicar problemas de qualidade ou dívida técnica."
                        type="bar-vertical"
                        stacked={true}
                    />
                </SimpleGrid>
            </Box>
        </Box>
    );
}
