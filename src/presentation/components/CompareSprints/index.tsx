import {
    Box,
    useToast,
    SimpleGrid,
    Center,
    Spinner,
    Text
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { MultiLineChart } from "../Charts/MultiLineChart";
import Chart from "../Chart";
import SearchableSelect from "../SearchableSelect";
import { useSprintComparison } from "../../hooks/useSprintComparison";
import { SprintComparisonDTO } from "../../../core/application/dtos/sprint-comparison.dto";
import { Sprint } from "../../../core/domain/entities/sprint.entity";

interface Team {
    id: string;
}

interface CompareSprintsProps {
    sprintTeam: Team;
    sprint: Sprint[]; // Usage of Domain Entity
}

interface SummarySprint extends SprintComparisonDTO { }

interface CondensedSprintsData {
    id: string[];
    name: string[];
    userStories: number[];
    bugs: number[];
    defects: number[];
    problems: number[];
    improvements: number[];
    notExpected: number[];
    points: number[];
    pointsDelivery: number[];
    pointsNotDelivered: number[];
}

const truncateLabel = (label: string, maxLength = 20) => {
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength) + "...";
};

const extractSprintData = <K extends keyof SummarySprint>(
    sprints: SummarySprint[],
    key: K
): SummarySprint[K][] => sprints.map((item) => item[key]);

export default function CompareSprints({ sprint, sprintTeam }: CompareSprintsProps) {
    const [condensedSprintsData, setCondensedSprintsData] = useState<CondensedSprintsData>();
    const [maxItems, setMaxItems] = useState("4");
    const toast = useToast();

    const { fetchComparison, isLoading } = useSprintComparison();

    const loadSprintData = useCallback(async () => {
        if (sprint.length === 0) {
            setCondensedSprintsData(undefined);
            return;
        }

        try {
            const summaryData = await fetchComparison({ teamId: sprintTeam.id, sprints: sprint });

            // Logic for condensed data (last N items)
            const condensed: CondensedSprintsData = {
                id: extractSprintData(summaryData, "id").slice(-Number(maxItems)),
                name: extractSprintData(summaryData, "name").slice(-Number(maxItems)),
                userStories: extractSprintData(summaryData, "userStories").slice(-Number(maxItems)),
                bugs: extractSprintData(summaryData, "bugs").slice(-Number(maxItems)),
                defects: extractSprintData(summaryData, "defects").slice(-Number(maxItems)),
                problems: extractSprintData(summaryData, "problems").slice(-Number(maxItems)),
                improvements: extractSprintData(summaryData, "improvements").slice(-Number(maxItems)),
                notExpected: extractSprintData(summaryData, "notExpected").slice(-Number(maxItems)),
                points: extractSprintData(summaryData, "points").slice(-Number(maxItems)),
                pointsDelivery: extractSprintData(summaryData, "pointsDelivery").slice(-Number(maxItems)),
                pointsNotDelivered: extractSprintData(summaryData, "pointsNotDelivered").slice(-Number(maxItems)),
            };

            setCondensedSprintsData(condensed);
        } catch (error) {
            console.error("Erro ao carregar dados dos sprints:", error);
            toast({
                title: "Erro ao carregar dados dos sprints",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [sprint, sprintTeam.id, toast, maxItems, fetchComparison]);

    useEffect(() => {
        void loadSprintData();
    }, [loadSprintData]);

    if (isLoading) {
        return (
            <Center h="400px">
                <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
            </Center>
        );
    }

    if (!condensedSprintsData) {
        return (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="100%">
                {[...Array(7)].map((_, i) => (
                    <Box key={i} height="450px" borderRadius={8} boxShadow="md" bg="gray.100" />
                ))}
            </SimpleGrid>
        );
    }

    return (
        <>
            <Box mb={4} maxW="300px">
                <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.700">
                    Selecione a quantidade de sprints
                </Text>
                <SearchableSelect
                    options={[{ value: "4", label: "4" }, { value: "6", label: "6" }, { value: "8", label: "8" }, { value: "10", label: "10" }]}
                    value={maxItems}
                    onChange={(selectedOption: string) => setMaxItems(selectedOption)}
                    placeholder="Selecione a quantidade"
                />
            </Box>

            <SimpleGrid
                columns={1}
                spacing={{ base: 4, sm: 5, md: 4 }}
                w="100%">
                <Chart
                    data={{ datasets: [{ data: condensedSprintsData.userStories }], labels: condensedSprintsData.name.map(label => truncateLabel(label)) }}
                    title="User Stories"
                    type="line"
                    multiColor={true}
                />
                <Chart
                    data={{ datasets: [{ data: condensedSprintsData.bugs }], labels: condensedSprintsData.name.map(label => truncateLabel(label)) }}
                    title="Bugs"
                    type="line"
                    multiColor={true}
                />
                <Chart
                    data={{ datasets: [{ data: condensedSprintsData.defects }], labels: condensedSprintsData.name.map(label => truncateLabel(label)) }}
                    title="Defects"
                    type="line"
                    multiColor={true}
                />
                <Chart
                    data={{ datasets: [{ data: condensedSprintsData.problems }], labels: condensedSprintsData.name.map(label => truncateLabel(label)) }}
                    title="Problems"
                    type="line"
                    multiColor={true}
                />
                <Chart
                    data={{ datasets: [{ data: condensedSprintsData.points }], labels: condensedSprintsData.name.map(label => truncateLabel(label)) }}
                    title="Points by Sprint"
                    type="line"
                    multiColor={true}
                />
                <Chart
                    data={{ datasets: [{ data: condensedSprintsData.pointsDelivery }], labels: condensedSprintsData.name.map(label => truncateLabel(label)) }}
                    title="Points Delivered by Sprint"
                    type="line"
                    multiColor={true}
                />
                <Chart
                    data={{ datasets: [{ data: condensedSprintsData.pointsNotDelivered }], labels: condensedSprintsData.name.map(label => truncateLabel(label)) }}
                    title="Points Not Delivered by Sprint"
                    type="line"
                    multiColor={true}
                />
            </SimpleGrid>
            <MultiLineChart
                title="Points by Sprint X Points delivered by sprint X Points not delivered by sprint"
                labels={condensedSprintsData.name.map(label => truncateLabel(label))}
                datasets={[
                    { label: "Points by Sprint", data: condensedSprintsData.points },
                    { label: "Points delivered by sprint", data: condensedSprintsData.pointsDelivery },
                    { label: "Points not delivered by sprint", data: condensedSprintsData.pointsNotDelivered },
                ]}
            />
        </>
    );
}
