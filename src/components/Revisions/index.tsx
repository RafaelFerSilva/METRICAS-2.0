import Report from "../../data/report";
import { Box, Flex } from "@chakra-ui/react";
import { ColumItemGraph } from "../ColumItemGraph";
import { ColumItemTable } from "../ColumItemTable";
import { Task } from "../../types/Task";

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
