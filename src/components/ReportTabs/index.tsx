import { Box, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { GraphicBoard } from "../GraphicBoard"
import { SprintMetricsService } from "../../core/domain/services/sprint-metrics.service";
import { UsHistory } from "../UsHistory";
import { Revisions } from "../Revisions";
import { Task } from "../../types/Task";

interface ReportProps {
    tasks: Task[]
}

const metricsService = new SprintMetricsService();

export default function ReportTabs(props: { tasks: Task[] }) {
    const tagsNotExpected = ["Não prevista", 'Não previsto', 'Adiantada']

    return (
        <Tabs size="sm" variant="enclosed" bg="white">
            <TabList>
                <Tab>General</Tab>
                <Tab>State Graph</Tab>
                <Tab>Board Column</Tab>
                <Tab>Bugs</Tab>
                <Tab>Improvements</Tab>
                <Tab>Not Expected</Tab>
                {/* <Tab>Related Bug</Tab> */}
                <Tab>Bugs - Roots Causes</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <GraphicBoard tasks={props.tasks} />
                </TabPanel>
                <TabPanel>
                    <UsHistory tasks={props.tasks} workItemType="User Story" />
                </TabPanel>
                <TabPanel>
                    <Revisions tasks={props.tasks} workItemType="User Story" />
                </TabPanel>
                <TabPanel>
                    <UsHistory tasks={props.tasks} workItemType="Bug" />
                </TabPanel>
                <TabPanel>
                    {
                        metricsService.returnAllTasksByWorkItemTag(props.tasks, "Melhoria").map((item: any, key: number) => {
                            return (
                                <Box key={key} mb="8">
                                    <Text>{item.ID} - {item.Title}</Text>
                                    <Divider />
                                </Box>
                            )
                        })
                    }
                </TabPanel>
                < TabPanel>
                    {
                        metricsService.returnTagsList(tagsNotExpected, props.tasks).map((item: any, key: number) => {
                            return (
                                <Box key={key} mb="8">
                                    <Text>{item.ID} - {item.Title}</Text>
                                    <Text></Text>
                                    <Divider />
                                </Box>
                            )
                        })
                    }
                </ TabPanel>
                <TabPanel>
                    {metricsService
                        .returnBugs(props.tasks)
                        .map((bug: any, key: number) => {
                            return (
                                <Box key={key} mb="8">
                                    <Text>{bug.ID} - {bug.Title}</Text>
                                    <Text><strong>Root Cause: </strong>{bug.Activity}</Text>
                                    <Divider />
                                </Box>
                            )
                        })}
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}
