import Report from "../../data/report";
import { Box, Flex } from "@chakra-ui/react";
import { ColumItemGraph } from "../ColumItemGraph";
import { ColumItemTable } from "../ColumItemTable";

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

interface UsHistoryProps {
  tasks: Task[];
  workItemType: string;
}

export function Revisions({ tasks, workItemType }: UsHistoryProps) {
  const report = new Report();

  return (
    <Flex >
      <Box >
        {report
          .returnAllTasksByWorkItemType(tasks, workItemType)
          .map((item: Task) => {
            return (
              <Box key={item.ID} >
                <ColumItemGraph  task={item} />
                <ColumItemTable task={item} />
              </Box>
            );
          })}
      </Box>
    </Flex>
  );
}
