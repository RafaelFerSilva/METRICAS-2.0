import Report from "../../data/report";
import { StateItemGraph } from "../StateItemGraph";
import { Box, Flex } from "@chakra-ui/react";
import { StateTable } from "../StateTable";
import { Task } from "../../types/Task";

interface UsHistoryProps {
  tasks: Task[];
  workItemType: string;
}

export function UsHistory({ tasks, workItemType }: UsHistoryProps) {
  const report = new Report();

  return (
    <Flex >
      <Box >
        {report
          .returnAllTasksByWorkItemType(tasks, workItemType)
          .map((item: Task, key) => {
            return (
              <Box key={key} >
                <StateItemGraph  task={item} />
                <StateTable task={item} />
              </Box>
            );
          })}
      </Box>
    </Flex>
  );
}
