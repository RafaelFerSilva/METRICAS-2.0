import { Box, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { GraphicBoard } from "../GraphicBoard"
import Report from "../../data/report";
import { UsHistory } from "../UsHistory";
import { Revisions } from "../Revisions";

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

interface ReportProps {
    tasks: Task[]
}

export default function ReportTabs(props: { tasks: Task[] }) {
    const tagsNotExpected = ["Não prevista", 'Não previsto']
    const report = new Report();

    const returnTagsList = (tags: string[]) => {
        let itens: any[] = []
        tags.map((tag) => {
            let usList = report.returnAllTasksByWorkItemTag(props.tasks, tag).map((item) => {
                return item
            })
            
            if(usList.length > 0){
                itens.push(usList)
            }
        })

        if(itens[0] !== undefined){
            return itens[0]
        }

        return []
    }

    return (
        <Tabs size="md" variant="enclosed" bg="white">
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
                        report.returnAllTasksByWorkItemTag(props.tasks, "Melhoria").map((item, key) => {
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
                        returnTagsList(tagsNotExpected).map((item, key) => {
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
                    {report
                        .returnBugs(props.tasks)
                        .map((bug, key) => {
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