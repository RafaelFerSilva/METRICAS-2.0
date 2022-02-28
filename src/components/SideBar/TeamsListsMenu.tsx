import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  List,
  ListItem,
  Stack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { TeamsContext } from "../../contexts/TeamsContext";
import { extendTheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      // ...
      900: "#1a202c",
    },
  },
  sizes: {
    xl: {
      h: "56px",
      fontSize: "lg",
      px: "32px",
    },
  },
});

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

interface TeamsListsMenuProps {
  setTeam: (team: Team) => void;
}

export function TeamsListsMenu({setTeam}: TeamsListsMenuProps) {
  const teams = useContext(TeamsContext);

  function handleClick(team: Team) {
    setTeam(team)
  };

  return (
    <Stack >
      <Accordion defaultIndex={[0]} allowMultiple >
        <AccordionItem sx={{border: 'none'}}>
          <AccordionButton >
            <Box flex="1">TEAMS</Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            pb={4}
            overflow="scroll"
            maxHeight="500"
            sx={{
              "&::-webkit-scrollbar": {
                width: "10px",
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `gray.500`,
              },
            }}
          >
            <List>
              {teams.map((team) => {
                return (
                  <Link key={team.id}>
                    <ListItem  mt="4" onClick={() => handleClick(team)}>
                      {team.name}
                    </ListItem>
                    <hr />
                  </Link>
                );
              })}
              )
            </List>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}
