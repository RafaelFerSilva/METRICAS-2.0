import { Box, Center, Divider, useToast, Stack, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";
import Loading from '../Loading';
import NewTasks from "../../model/tasks";
import Report from "../../data/report";
import { GenericTable } from "../GenericTable";
import { VerticalBar } from "../Charts/ChartVerticalBar";
import { GenericGraphic } from "../GenericGraphic";
import { ChartVerticalBarDataSets } from "../Charts/ChartVerticalBarDataSets";

export interface WorkRelations {
    rel: string;
    source: string;
    target: {
        id: number;
        url: string;
    };
}
interface Task {
    ID: string;
    Title: string;
    "Work Item Type": string;
    State: string;
    "State Change Date": string;
    Area: string;
    "Iteration Path": string;
    "Activated By": string;
    "Activated Date": string;
    "Assigned To": string | undefined;
    "Changed By": string;
    "Changed Date": string;
    "Completed Work": string | undefined;
    "Created By": string;
    "Created Date": string;
    Description: string | undefined;
    Reason: string;
    "Story Points": number | undefined | string;
    "Cycle Time": number | undefined;
    "Sprint Start Date": string;
    Tags: string;
    Activity: string;
}

interface Team {
    id: string;
}

interface CompareSprintsProps {
    sprintTeam: Team,
    sprint: Iterations[]
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
    sprintName: string
}

interface SummarySprint {
    id: string;
    name: string;
    userStories: number;
    bugs: number;
    improvements: number;
    notExpected: number;
    points: number;
    entegues: number;
    naoEntregue: number
}

interface CondensedSprintsData {
    id: string[];
    name: string[];
    userStories: number[];
    bugs: number[];
    improvements: number[];
    notExpected: number[];
    points: number[];
    entegues: number[];
    naoEntregue: number[]
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function CompareSprints({
    sprint,
    sprintTeam
}: CompareSprintsProps) {
    const tagsNotExpected = ["Não prevista", 'Não previsto']
    const [summarySprint, setSummarySprint] = useState<SummarySprint[]>([])
    const [condensedSprintsData, setCondensedSprintsData] = useState<CondensedSprintsData>()
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast()
    const report = new Report();

    const returnSprintsData = (sprints: SummarySprint[], arg: string) => {
        let value = sprints.map((item) => {
            return item[arg]
        })

        return value
    }

    useEffect(() => {
        const fetchWorkItens = async (sprintId: string) => {
            try {
                let workitens: number[] = await axiosInstance
                    .get(
                        `https://dev.azure.com/${organization}/${project_id}/${sprintTeam}/_apis/work/teamsettings/iterations/${sprintId}/workitems?api-version=6.0-preview.1`
                    )
                    .then(async (response) => {
                        let itens: any;
                        if (response.status === 200) {
                            if (response.data.workItemRelations.length > 0) {
                                itens = response.data.workItemRelations.map((item: WorkRelations) => {
                                    return item.target.id;
                                });
                            }
                        }
                        return itens;
                    })

                return workitens
            } catch (error) {
                console.log(error)
            }
        }

        const fetchAllSprintTasks = async (sprint: Iterations[]) => {
            try {
                let returnItem = sprint.map(async (spt) => {
                    if (spt.attributes.timeFrame !== 'future') {
                        let workitens = await fetchWorkItens(spt.id)

                        if (workitens !== undefined) {
                            if (workitens.length !== 0) {
                                let sprintItem: SprintTasks = await axiosInstance
                                    .get(`wit/workitems?ids=${workitens}&expand=all&api-version=6.0`)
                                    .then((response) => {
                                        if (response.status === 200) {
                                            const newTasks = new NewTasks();
                                            let formatedTasks: Task[] = newTasks.formatJson(
                                                response.data.value
                                            );
                                            return {
                                                sprintid: spt.id,
                                                sprintName: spt.name,
                                                tasks: formatedTasks
                                            }
                                        }
                                    });

                                return sprintItem
                            }
                        }
                    }
                })

                return Promise.all(returnItem)
            } catch (error) {
                console.log(error)
            }
        }

        try {
            if (sprint.length > 0) {
                void async function () {
                    setIsLoading(true)
                    let allSprintTasks: SprintTasks[] = await fetchAllSprintTasks(sprint)
                    let removeUndefined = allSprintTasks.filter((itemFilter) => itemFilter !== undefined)
                    let dataItem = removeUndefined.map((data) => {
                        let summaryItem: SummarySprint
                        summaryItem = {
                            id: data.sprintid,
                            name: data.sprintName,
                            userStories: report.returnAllTasksByWorkItemType(data.tasks, "User Story").length,
                            bugs: report.returnAllTasksByWorkItemType(data.tasks, "Bug").length,
                            improvements: report.returnAllTasksByWorkItemTag(data.tasks, "Melhoria").length,
                            notExpected: report.returnTagsList(tagsNotExpected, data.tasks).length,
                            points: report.returnTasksPoints(report.returnAllTasksByWorkItemType(data.tasks, "User Story")),
                            entegues: report.returnTasksPoints(report.returnAllTasksByWorkItemType(report.returnTasksCompleted(data.tasks), "User Story")),
                            naoEntregue: report.returnTasksPoints(report.returnAllTasksByWorkItemType(report.returnTasksNotCompleted(data.tasks), "User Story"))
                        }

                        return summaryItem
                    })
                    dataItem = dataItem.reverse()
                    let condensed: CondensedSprintsData = {
                        name: returnSprintsData(dataItem, "name"),
                        id: returnSprintsData(dataItem, "id"),
                        userStories: returnSprintsData(dataItem, "userStories"),
                        bugs: returnSprintsData(dataItem, "bugs"),
                        improvements: returnSprintsData(dataItem, "improvements"),
                        notExpected: returnSprintsData(dataItem, "notExpected"),
                        points: returnSprintsData(dataItem, "points"),
                        entegues: returnSprintsData(dataItem, "entegues"),
                        naoEntregue: returnSprintsData(dataItem, "naoEntregue")
                    }

                    setCondensedSprintsData(condensed)
                    setSummarySprint(dataItem)
                    setIsLoading(false)
                }()
            } else {
                setSummarySprint([])
            }
        } catch (error) {
            console.log(error)
        }
    }, [sprint, sprintTeam, toast])

    return (
        <>
            {/* {console.log(condensedSprintsData.id)} */}
            {condensedSprintsData &&
                <>
                    <GenericGraphic title="User Stories by Sprint" label="User Stories by Sprint" labels={condensedSprintsData.name} data={condensedSprintsData.userStories} />
                    <GenericGraphic title="Bugs by Sprint" label="Bugs by Sprint" labels={condensedSprintsData.name} data={condensedSprintsData.bugs} />
                    <GenericGraphic title="Improvements by Sprint" label="Improvements by Sprint" labels={condensedSprintsData.name} data={condensedSprintsData.improvements} />
                    <GenericGraphic title="User Stories not Expected by Sprint" label="User Stories not Expected by Sprint" labels={condensedSprintsData.name} data={condensedSprintsData.notExpected} />
                    <Flex justifyContent="center">
                        <Box
                            p={["4", "5"]}
                            bg="Snow"
                            borderRadius={8}
                            pb="4"
                            mb="4"
                            mt="4"
                            maxWidth="1020px"
                            minWidth="920px"
                        >
                            <ChartVerticalBarDataSets
                                title="Points by Sprint X Points delivered by sprint X Points not delivered by sprint"
                                labels1={condensedSprintsData.name}
                                data1={condensedSprintsData.points}
                                label1="Points by Sprint"
                                labels2={condensedSprintsData.name}
                                data2={condensedSprintsData.entegues}
                                label2="Points delivered by sprint"
                                labels3={condensedSprintsData.name}
                                data3={condensedSprintsData.naoEntregue}
                                label3="Points not delivered by sprint"
                            />
                        </Box>
                    </Flex>
                </>
            }
        </>
    );

}
