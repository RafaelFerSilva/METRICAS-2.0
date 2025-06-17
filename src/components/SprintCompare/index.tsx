// import { withSession } from "../services/auth/session";
import {
  Badge,
  Box,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { TeamsProvider } from "../../contexts/TeamsContext";
import TeamSelect from "../TeamSelect";
import Loading from '../Loading';
import { tokenService } from "../../services/auth/tokenService";
import { setupAPIMetrics } from "../../services/api";
import NewTasks from "../../model/tasks";
import CompareSprints from "../CompareSprints";
import { Task } from "../../types/Task";
import { MdDashboard } from "react-icons/md";
import ModernSelectSprintForm from "../SelectSprintForm/ModernSelectSprintForm";
import ModernTeamSelect from "../TeamSelect/ModernTeamSelect";
import ModernEmptyState from "../EmptyState/ModernEmptyState";
import { SpinnerContent } from "../Spinner";
import { withSession } from "../../services/auth/session";

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
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

interface sprintTasks {
  tasks: Task[];
  sprintid: string
  sprintName: string
}

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export default function SprintCompare() {
  // const [sprintTasks, setSprintTasks] = useState<sprintTasks[]>([])
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintTeam, setSprintTeam] = useState<Team>();
  const [sprint, setSprint] = useState<Iterations[]>([]);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [isLoading, setIsLoading] = useState(false);

  const renderContent = () => {
    if (!sprintTeam) {
      return (
        <ModernEmptyState
          type="no-selection"
          title="Selecione um Time para Começar"
          description="Para visualizar os gráficos e métricas do sprint, primeiro selecione um time na seção acima."
          onAction={() => {
            // Scroll para o seletor de time
            document.querySelector('[data-testid="team-selector"]')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}
        />
      );
    }

    if (sprint.length > 0) {
        return <CompareSprints sprint={sprint} sprintTeam={sprintTeam} />;
    }
  };

  return (
    <TeamsProvider>
      <Box bg={bgColor} minH="100vh" overflowX="hidden">
        <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
          <VStack spacing={8} align="stretch" py={6}>
            <Box
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              position="relative"
              overflow="visible"
              zIndex={1}
            >
              <VStack spacing={6} align="stretch">
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={{ base: 4, md: 6 }}
                  w="100%"
                >
                  <Box data-testid="team-selector" position="relative" zIndex={30}>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.700">
                      Selecionar Time
                    </Text>
                    <ModernTeamSelect
                      setSprint={setSprint}
                      setTask={setTasks}
                      setTeam={setSprintTeam}
                    />
                  </Box>
                </SimpleGrid>


                {sprintTeam && (
                  <Box
                    p={6}
                    bg="blue.50"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="blue.200"
                  >
                    <HStack spacing={6} wrap="wrap" justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="blue.600" fontWeight="medium">
                          Time Selecionado
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color="blue.800">
                          {sprintTeam.name}
                        </Text>
                      </VStack>
                      {sprint.length > 0 && (
                        <VStack align="end" spacing={1}>
                          <Text fontSize="sm" color="blue.600" fontWeight="medium">
                            Sprints Disponíveis
                          </Text>
                          <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                            {sprint.length} sprints
                          </Badge>
                        </VStack>
                      )}
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
            {renderContent()}
          </VStack>
        </Container>
      </Box>
    </TeamsProvider>
  );
}

export const getServerSideProps = withSession((ctx: any) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});
