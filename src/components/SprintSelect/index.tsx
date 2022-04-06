import { Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { setupAPIMetrics } from "../../services/api";

export interface WorkRelations {
  rel: string;
  source: string;
  target: {
    id: number;
    url: string;
  };
}
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

interface Team {
  id: string;
}

interface SelectSprintProps {
  teamId: Team;
  setworkItemRelations?: (itemRelations: WorkRelations[]) => void;
  setTasks?: (task: Task[]) => void;
}

export interface Iterations {
  id: string;
  name: string;
  path: string;
  attributes: {
    startDate: string;
    finishDate: string;
    timeFrame: string;
  };
  url: string;
}

const axiosInstance = setupAPIMetrics();

export default function SprintSelect({
  teamId,
  setworkItemRelations,
  setTasks,
}: SelectSprintProps) {
  const [selectedSprint, setSeletedSprint] = useState("");
  const [sprint, setSprint] = useState<Iterations[]>([]);

  useEffect(() => {
    axiosInstance
      .get(
        `https://dev.azure.com/${process.env.NEXT_PUBLIC_ORGANIZATION}/${process.env.NEXT_PUBLIC_PROJECT}/${teamId}/_apis/work/teamsettings/iterations?api-version=6.0`
      )
      .then((response) => {
        setSprint(response.data.value.reverse());
      });
  }, [teamId]);

  const handleChange = (event: any) => {
    setSeletedSprint(event.target.value);

    axiosInstance
      .get(
        `https://dev.azure.com/${process.env.NEXT_PUBLIC_ORGANIZATION}/${process.env.NEXT_PUBLIC_PROJECT}/${teamId}/_apis/work/teamsettings/iterations/${event.target.value}/workitems?api-version=6.0-preview.1`
      )
      .then((response) =>
        setworkItemRelations(response.data.workItemRelations)
      );

    setTasks([]);
  };

  return (
    <>
      <VStack spacing="8">
        <SimpleGrid
          minChildWidth="240px"
          spacing={["6", "8"]}
          alignSelf="flex-start"
        >
          <VStack spacing={3}>
            <Select
              placeholder="Sprints"
              size="lg"
              onChange={(ev) => handleChange(ev)}
              value={selectedSprint}
            >
              {sprint.map((item: Iterations) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Select>
          </VStack>
        </SimpleGrid>
      </VStack>
    </>
  );
}
