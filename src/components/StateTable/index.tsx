import { Box, Divider } from "@chakra-ui/react";
import { GenericTable } from "../GenericTable";
import { Task } from "../../types/Task";
import { useWorkItemHistory } from "../../presentation/hooks/useWorkItemHistory";

interface StateTableProps {
  task: Task;
}

export function StateTable({ task }: StateTableProps) {
  const { data: stateTime } = useWorkItemHistory(task.ID, task.Title);

  return (
    <Box mb="3" maxWidth={2020}>
      <GenericTable
        title=""
        labels={stateTime?.stateElement}
        data={stateTime?.timeElement}
      />
      <Divider mt="5" orientation='horizontal' />
    </Box>
  );
}
