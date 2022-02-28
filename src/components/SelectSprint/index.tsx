import { Box, Button, Divider, Heading, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NewTasks from "../../model/tasks";
import { setupAPIMetrics } from "../../services/api";
import SelectSprintForm from "../SelectSprintForm";
import SprintSelect from "../SprintSelect";
import TeamSelect from "../TeamSelect";

interface Team {
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

export interface WorkRelations {
  rel: string;
  source: string;
  target: {
    id: number;
    url: string;
  };
}

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

interface SelectSprintProps {
  setTasks?: (task: Task[]) => any;
  setSprintTeam?: (team: any) => any;
}

export default function SelectSprint({ setTasks, setSprintTeam }: SelectSprintProps) {
  const [team, setTeam] = useState<Team>();

  useEffect(() => {
    setSprintTeam(team)
  },[setSprintTeam, team])

  return (
    <Box d="flex" borderRadius={8} bg="white" p={["6", "8"]} gap="5">
      <TeamSelect setTeam={setTeam} setTask={setTasks}/>
      {team && <SelectSprintForm team={team} setTasks={setTasks} />}
    </Box>
  );
}
