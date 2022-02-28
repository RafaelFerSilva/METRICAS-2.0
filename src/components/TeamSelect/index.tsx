import { Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { TeamsContext } from "../../contexts/TeamsContext";

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
  setTeam: (team: Team) => void;
  setTask: (team: any) => void;
}

export default function SprintSelect({ setTeam, setTask }: SelectTeamProps) {
  const [selectedTeam, setSeletedTeam] = useState("");
  const teams = useContext(TeamsContext);

  const handleChange = (event: any) => {
    setSeletedTeam(event.target.value);
    setTeam(event.target.value);
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
              placeholder="Teams"
              size="lg"
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
