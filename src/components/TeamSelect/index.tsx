import { Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { TeamsContext } from "../../contexts/TeamsContext";
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from "../../services/auth/tokenService";

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

interface SelectTeamProps {
  setSprint: (sprints: Iterations[]) => void;
  setTeam: (team: Team) => void;
  setTask: (task: any) => void;
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

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({organization, project_id ,token} );

export default function SprintSelect({ setSprint, setTask, setTeam }: SelectTeamProps) {
  const [selectedTeam, setSeletedTeam] = useState("");
  const teams = useContext(TeamsContext);

  const handleChange = (event: any) => {
    setSeletedTeam(event.target.value);
    setTeam(event.target.value);
    axiosInstance
      .get(
        `https://dev.azure.com/${organization}/${project_id}/${event.target.value}/_apis/work/teamsettings/iterations?api-version=6.0`
      )
      .then((response) => {
        if(response.status === 200) {
          setSprint(response.data.value.reverse());
        } 
      })
    setTask([])
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
              borderRadius={6}
              size="sm"
              placeholder="Teams"
              onChange={(ev) => handleChange(ev)}
              value={selectedTeam}
            >
              {teams.map((team: any) => {
                return (
                  <option key={team.id} value={team.id}>
                    {team.name}
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
