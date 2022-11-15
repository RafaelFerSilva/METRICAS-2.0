import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectSprintForm from "../SelectSprintForm";
import TeamSelect from "../TeamSelect";

interface Team {
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
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

interface SelectSprintProps {
  setTasks?: (task: Task[]) => any;
  setSprintTeam?: (team: any) => any;
}

export default function SelectSprint({
  setTasks,
  setSprintTeam,
}: SelectSprintProps) {
  const [team, setTeam] = useState<Team>();

  useEffect(() => {
    setSprintTeam(team);
  }, [setSprintTeam, team]);

  return (
    <Box display="flex" mt="1px" bg="white" p={["6", "8"]} gap="5">
      <TeamSelect setTeam={setTeam} setTask={setTasks} />
      {team && <SelectSprintForm team={team} setTasks={setTasks} />}
    </Box>
  );
}
