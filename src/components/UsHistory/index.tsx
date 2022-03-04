import Report from "../../data/report";
import { StateItemGraph } from "../StateItemGraph";
import { Box, Flex, Heading, Link, SimpleGrid, Stack } from "@chakra-ui/react";
import { StateTable } from "../StateTable";
import { RelatedBugs } from "../RelatedBugs";

export interface Task {
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
  "Time To Resolve Task": number | undefined;
  "Time To Change State": number | undefined;
  "Time To Autorize": number | undefined;
  "Time Total": number | undefined;
  "Sprint Start Date": string;
  Tags: string;
}

interface UsHistoryProps {
  tasks: Task[];
  workItemType: string;
}

export function UsHistory({ tasks, workItemType }: UsHistoryProps) {
  const report = new Report();

  return (
    <Flex justifyContent="center">
      <Box >
        {report
          .returnAllTasksByWorkItemType(tasks, workItemType)
          .map((item: Task) => {
            return (
              < >
                <StateItemGraph key={item.ID} task={item} />
              </>
            );
          })}
      </Box>
    </Flex>
  );
}
