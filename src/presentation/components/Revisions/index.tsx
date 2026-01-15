import { SprintMetricsService } from "../../../core/domain/services/sprint-metrics.service";
import { Box, Flex } from "@chakra-ui/react";
import { ColumItemGraph } from "../ColumItemGraph";
import { ColumItemTable } from "../ColumItemTable";
import { Task } from "../../../core/shared/types/Task";

interface UsHistoryProps {
  tasks: Task[];
  workItemType: string;
}

const metricsService = new SprintMetricsService();

export function Revisions({ tasks, workItemType }: UsHistoryProps) {

  return (
    <Flex >
      <Box >
        {metricsService
          .returnAllTasksByWorkItemType(tasks, workItemType)
          .map((item: Task) => {
            return (
              <Box key={item.ID} >
                <ColumItemGraph task={item} />
                <ColumItemTable task={item} />
              </Box>
            );
          })}
      </Box>
    </Flex>
  );
}
