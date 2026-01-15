import { SprintMetricsService } from "../../core/domain/services/sprint-metrics.service";
import { StateItemGraph } from "../StateItemGraph";
import { Box, Flex } from "@chakra-ui/react";
import { StateTable } from "../StateTable";
import { Task } from "../../types/Task";

interface UsHistoryProps {
  tasks: Task[];
  workItemType: string;
}

const metricsService = new SprintMetricsService();

export function UsHistory({ tasks, workItemType }: UsHistoryProps) {

  return (
    <Flex >
      <Box >
        {metricsService
          .returnAllTasksByWorkItemType(tasks, workItemType)
          .map((item: Task, key) => {
            return (
              <Box key={key} >
                <StateItemGraph task={item} />
                <StateTable task={item} />
              </Box>
            );
          })}
      </Box>
    </Flex>
  );
}
