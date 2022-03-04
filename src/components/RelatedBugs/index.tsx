import { useEffect, useState } from "react";
import NewTasks from "../../model/tasks";
import {
  setupAPIMetrics,
} from "../../services/api";
import { RelatedItem } from "../../hooks/RelatedItem";
import { Box, Divider, Heading, Link, Text } from "@chakra-ui/react";

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
  "Time To Resolve Task": number | undefined;
  "Time To Change State": number | undefined;
  "Time To Autorize": number | undefined;
  "Time Total": number | undefined;
  "Sprint Start Date": string;
  Tags: string;
  Activity: string;
}

interface RelatedBugsProps {
  task: Task;
}

const axiosInstance = setupAPIMetrics();

export function RelatedBugs({ task }: RelatedBugsProps) {
  const workRelated = RelatedItem(task);
  const [relatedItem, setRelateItem] = useState<Task[]>();
  const [bug, setBug ] = useState<Task[]>();

  useEffect(() => {
    if (workRelated.length !== 0) {
      axiosInstance
        .get(
          `wit/workitems?ids=${workRelated.toString()}&expand=all&api-version=6.0`
        )
        .then((response) => {
          if (response.status === 200) {
            const newTasks = new NewTasks();
            let formatedTasks: Task[] = newTasks.formatJson(
              response.data.value
            );
            setRelateItem(formatedTasks);
          }
        });
    }
    
  }, [workRelated]);

  useEffect(() => {
    const bugs = relatedItem?.filter(
      (item) => item["Work Item Type"] === "Bug"
    );

    setBug(bugs)
  },[relatedItem])

  function returnBugs() {
    const bugs = relatedItem?.filter(
      (item) => item["Work Item Type"] === "Bug"
    );

    return typeof bugs?.length !== "undefined" ? (
      bugs?.map((item: Task, key: any) => {
        return (
          <Text key={key} fontSize="12">
            {item.ID} - {item.Title}
          </Text>
        );
      })
    ) : (
      <Text fontSize="12">Está US não teve bugs relacionados</Text>
    );
  }

  return (
    <Box mb="8">
      <Heading as="h3" size="sm">
        {task.ID} - {task.Title}
      </Heading>
      
      {returnBugs()}
      <Divider />
    </Box>
  );
}
