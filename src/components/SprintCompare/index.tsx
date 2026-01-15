import {
  Badge,
  Box,
  Container,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";

import { useState } from "react";
import { TeamsProvider } from "../../contexts/TeamsContext";
import ModernTeamSelect from "../TeamSelect/ModernTeamSelect";
import ModernEmptyState from "../EmptyState/ModernEmptyState";
import CompareSprints from "../CompareSprints";
import { useSprintReport } from "../../presentation/hooks/useSprintReport";
import { withSession } from "../../services/auth/session";
import { Sprint } from "../../core/domain/entities/sprint.entity";

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

export default function SprintCompare() {
  const [sprintTeam, setSprintTeam] = useState<Team>();
  const [sprint, setSprint] = useState<Sprint[]>([]);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const { fetchSprints } = useSprintReport();

  const handleTeamSelected = async (team: any) => {
    setSprintTeam(team);
    try {
      const sprints = await fetchSprints(team.id);
      setSprint(sprints);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

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
      <Box bg={bgColor} minH="100vh" >
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
                      onTeamSelected={handleTeamSelected}
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
