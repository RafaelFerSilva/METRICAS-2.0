import {
    Box,
    useToast,
    SimpleGrid,
    Center,
    Spinner,
    Select,
    Text
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";
import NewTasks from "../../model/tasks";
import Report from "../../data/report";
import { MultiLineChart } from "../Charts/MultiLineChart";
import { Task } from "../../types/Task";
import Chart from "../Chart";
import SearchableSelect from "../SearchableSelect";

export interface WorkRelations {
    rel: string;
    source: string;
    target: {
        id: number;
        url: string;
    };
}

interface Team {
    id: string;
}

interface CompareSprintsProps {
    sprintTeam: Team;
    sprint: Iterations[];
}

export interface Iterations {
    id: string;
    name: string;
    path: string;
    attributes: {
        startDate: string;
        finishDate: string;
        timeFrame: string;
    };
    url: string;
}

interface SprintTasks {
    tasks: Task[];
    sprintid: string;
    sprintName: string;
}

interface SummarySprint {
    id: string;
    name: string;
    userStories: number;
    bugs: number;
    defects: number;
    problems: number;
    improvements: number;
    notExpected: number;
    points: number;
    pointsDelivery: number;
    pointsNotDelivered: number;
}

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

const token = tokenService.getToken();
const project_id = tokenService.getProjectId();
const organization = tokenService.getOrganization();

const axiosInstance = setupAPIMetrics({ organization, project_id, token });
const tagsNotExpected = ["Não prevista", "Não previsto"];
const report = new Report();


const truncateLabel = (label: string, maxLength = 20) => {
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength) + "...";
  };

const extractSprintData = <K extends keyof SummarySprint>(
    sprints: SummarySprint[],
    key: K
): SummarySprint[K][] => sprints.map((item) => item[key]);

const fetchWorkItems = async (sprintId: string, sprintTeamId: string) => {
    try {
        const response = await axiosInstance.get(
            `https://dev.azure.com/${organization}/${project_id}/${sprintTeamId}/_apis/work/teamsettings/iterations/${sprintId}/workitems?api-version=7.1-preview.1`
        );
        if (response.status === 200 && response.data.workItemRelations?.length > 0) {
            return response.data.workItemRelations.map((item: WorkRelations) => item.target.id);
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar work items:", error);
        return [];
    }
};

const fetchAllSprintTasks = async (sprints: Iterations[], sprintTeamId: string) => {
    const sprintTasksPromises = sprints.map(async (spt) => {
        if (spt.attributes.timeFrame === "future") return undefined;

        const workItems = await fetchWorkItems(spt.id, sprintTeamId);
        if (!workItems || workItems.length === 0) return undefined;

        try {
            const response = await axiosInstance.get(
                `wit/workitems?ids=${workItems}&expand=all&api-version=7.1`
            );
            if (response.status === 200) {
                const newTasks = new NewTasks();
                const formattedTasks: Task[] = newTasks.formatJson(response.data.value);
                return {
                    sprintid: spt.id,
                    sprintName: spt.name,
                    tasks: formattedTasks,
                } as SprintTasks;
            }
        } catch (error) {
            console.error("Erro ao buscar tasks do sprint:", error);
        }
        return undefined;
    });

    const results = await Promise.all(sprintTasksPromises);
    return results.filter((item): item is SprintTasks => item !== undefined);
};

export default function CompareSprints({ sprint, sprintTeam }: CompareSprintsProps) {
    const [summarySprint, setSummarySprint] = useState<SummarySprint[]>([]);
    const [condensedSprintsData, setCondensedSprintsData] = useState<CondensedSprintsData>();
    const [isLoading, setIsLoading] = useState(false);
    const [maxItems, setMaxItems] = useState("4");
    const toast = useToast();

    const loadSprintData = useCallback(async () => {
        if (sprint.length === 0) {
            setSummarySprint([]);
            setCondensedSprintsData(undefined);
            return;
        }

        setIsLoading(true);
        try {
            const allSprintTasks = await fetchAllSprintTasks(sprint, sprintTeam.id);

            const summaryData: SummarySprint[] = allSprintTasks.map((data) => ({
                id: data.sprintid,
                name: data.sprintName,
                userStories: report.returnAllTasksByWorkItemType(data.tasks, "User Story").length,
                bugs: report.returnAllTasksByWorkItemType(data.tasks, "Bug").length,
                defects: report.returnAllTasksByWorkItemType(data.tasks, "Defect").length,
                problems: report.returnAllTasksByWorkItemType(data.tasks, "Problems").length,
                improvements: report.returnAllTasksByWorkItemTag(data.tasks, "Melhoria").length,
                notExpected: report.returnTagsList(tagsNotExpected, data.tasks).length,
                points: report.returnTasksPoints(
                    report.returnAllTasksByWorkItemType(data.tasks, "User Story")
                ),
                pointsDelivery: report.returnTasksPoints(
                    report.returnAllTasksByWorkItemType(report.returnTasksCompleted(data.tasks), "User Story")
                ),
                pointsNotDelivered: report.returnTasksPoints(
                    report.returnAllTasksByWorkItemType(report.returnTasksNotCompleted(data.tasks), "User Story")
                ),
            }));

            summaryData.reverse();

            const condensed: CondensedSprintsData = {
                id: extractSprintData(summaryData, "id").slice(-maxItems),
                name: extractSprintData(summaryData, "name").slice(-maxItems),
                userStories: extractSprintData(summaryData, "userStories").slice(-maxItems),
                bugs: extractSprintData(summaryData, "bugs").slice(-maxItems),
                defects: extractSprintData(summaryData, "defects").slice(-maxItems),
                problems: extractSprintData(summaryData, "problems").slice(-maxItems),
                improvements: extractSprintData(summaryData, "improvements").slice(-maxItems),
                notExpected: extractSprintData(summaryData, "notExpected").slice(-maxItems),
                points: extractSprintData(summaryData, "points").slice(-maxItems),
                pointsDelivery: extractSprintData(summaryData, "pointsDelivery").slice(-maxItems),
                pointsNotDelivered: extractSprintData(summaryData, "pointsNotDelivered").slice(-maxItems),
            };

            setSummarySprint(summaryData);
            setCondensedSprintsData(condensed);
        } catch (error) {
            console.error("Erro ao carregar dados dos sprints:", error);
            toast({
                title: "Erro ao carregar dados dos sprints",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    }, [sprint, sprintTeam.id, toast, maxItems]);

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
