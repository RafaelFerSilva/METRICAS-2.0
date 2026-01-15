
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Text,
  SimpleGrid,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Badge,
  Divider,
  Accordion,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { MdList } from "react-icons/md";

import { TeamsProvider } from "../../contexts/TeamsContext";
import ModernSelectSprintForm from "../SelectSprintForm/ModernSelectSprintForm";
import ModernTeamSelect from "../TeamSelect/ModernTeamSelect";
import ModernEmptyState from "../EmptyState/ModernEmptyState";
import { SpinnerContent } from "../Spinner";
import SprintReportCards from "./SprintReportCards";
import { QualityMetrics } from "./QualityMetrics";
import { UserStoryDistribution } from "./UserStoryDistribution";
import { InconsistencyAlert } from "./InconsistencyAlert";
import SprintAlert from "./SprintAlert";
import PercentSprintReportCard from "./PecentSprintReportCard";
import SprintStateItens from "./SprintStateItens";
import SprintProgressItem from "./SprintProgressItem";
import { Task, Sprint } from "../../../core/domain/entities/sprint.entity";
import TableComponent from "../TableComponent";
import { AccordionSection } from "../AccordionSection";
import { useSprintReport } from "../../hooks/useSprintReport";
import { SprintMetricsService } from "../../../core/domain/services/sprint-metrics.service";

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

// Temporary Service instantiation for table helpers if needed, 
// or we rely on the hook's returned metrics. 
// However, the table component needs raw arrays which are in metrics val obj.
const metricsService = new SprintMetricsService();

export default function CompleteDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintTeam, setSprintTeam] = useState<Team>();
  const [sprint, setSprint] = useState<Sprint[]>([]);
  const [showRelatedUSs, setShowRelatedUSs] = useState<boolean>(true);

  // Clean Architecture Hook
  const { fetchSprints, fetchReport, isLoadingReport } = useSprintReport();
  const [sprintMetrics, setSprintMetrics] = useState<any>(null); // Use SprintMetrics type ideally

  const media = 100
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const userStoryTableHeaders = ["ID", "Title", "State", "Assigned To", "Reason", "Priority"];
  const bugTableHeaders = ["ID", "Title", "State", "Assigned To", "Reason", "Priority", "Severity"];

  const handleTeamSelect = async (team: Team) => {
    setSprintTeam(team);
    setTasks([]);
    setSprintMetrics(null);
    try {
      const sprints = await fetchSprints(team.id);
      setSprint(sprints);
    } catch (error) {
      console.error("Failed to fetch sprints", error);
    }
  };

  const handleSprintSelect = async (sprintId: string) => {
    try {
      if (!sprintTeam) return;
      const data = await fetchReport({ teamId: sprintTeam.id, sprintId });
      setTasks(data.tasks);
      setSprintMetrics(data.metrics);
    } catch (error) {
      console.error("Failed to fetch report", error);
    }
  };

  const renderContent = () => {
    if (isLoadingReport) {
      return (
        <SpinnerContent text="Carregando dados..." />
      );
    }

    if (!sprintTeam) {
      return (
        <ModernEmptyState
          type="no-selection"
          title="Selecione um Time para Começar"
          description="Para visualizar os gráficos e métricas do sprint, primeiro selecione um time na seção acima."
          onAction={() => {
            document.querySelector('[data-testid="team-selector"]')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      );
    }

    if (!sprintMetrics || tasks.length === 0) {
      return (
        <ModernEmptyState
          type="no-results"
          title="Sprint sem Dados"
          description="A sprint selecionada não possui itens de trabalho ou ainda não foi iniciada."
          actionLabel="Selecionar Outra Sprint"
          onAction={() => {
            document.querySelector('[data-testid="sprint-selector"]')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      );
    }

    const m = sprintMetrics;

    return (
      <VStack spacing={8} align="stretch" w="100%">
        <SprintAlert bugs={m.bugs} defects={m.defects} problems={m.problems} totalStoryPoints={m.totalStoryPoints} completedStoryPoints={m.completedStoryPoints} />
        <SprintReportCards userStories={m.userStories} bugs={m.bugs} defects={m.defects} problems={m.problems} totalStoryPoints={m.totalStoryPoints} completedStoryPoints={m.completedStoryPoints} tasks={tasks} />

        {/* Inconsistency Alert */}
        <InconsistencyAlert
          storyPointsRate={m.storyPointsRate}
          usCompletionRate={m.usRate}
        />

        {/* Quality Metrics */}
        <QualityMetrics
          bugs={m.bugs}
          defects={m.defects}
          problems={m.problems}
          userStories={m.directUserStories}
          totalItems={tasks.length}
          averageCycleTime={m.averageCycleTime}
          averageLeadTime={m.averageLeadTime}
        />

        {/* User Story Distribution */}
        {m.relatedUserStories.length > 0 && (
          <UserStoryDistribution
            directUserStories={m.directUserStories}
            relatedUserStories={m.relatedUserStories}
            directStoryPoints={m.totalStoryPoints}
            relatedStoryPoints={m.relatedTotalStoryPoints}
          />
        )}
        <PercentSprintReportCard userStories={m.userStories} userStoriesRate={m.userStoriesRate} bugs={m.bugs} defects={m.defects} problems={m.problems} totalStoryPoints={m.totalStoryPoints} media={media} />
        <SprintStateItens userStories={m.userStories} bugs={m.bugs} defects={m.defects} problems={m.problems} taskItems={m.taskItems} userStoryStatesData={m.userStoryStatesData} bugStatesData={m.bugStatesData} defectStatesData={m.defectStatesData} problemsStateData={m.problemsStateData} taskStatesData={m.taskStatesData} />

        <Divider />

        {/* Top 3 Progress Bars */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
          <SprintProgressItem title="Progresso por Story Points" itemPorcentage={m.storyPointsRate} completed_itens={m.completedStoryPoints} total={m.totalStoryPoints} color="purple" />
          <SprintProgressItem title="Progresso por User Story" itemPorcentage={m.usRate} completed_itens={m.completedUserStories} total={m.userStories.length} color="blue" />
          <SprintProgressItem title="Progresso Geral" itemPorcentage={m.completionRate} completed_itens={m.completedTasks.length} total={tasks.length} color="green" />
        </SimpleGrid>

        <Divider />

        <HStack justify="space-between" align="center">
          <HStack>
            <Icon as={MdList} color="blue.500" boxSize={10} />
            <Text fontSize="x-large" fontWeight="semibold" color="gray.700">
              Listagem de itens da sprint
            </Text>
          </HStack>

          {/* Toggle for Related User Stories */}
          {m.relatedUserStories.length > 0 && (
            <FormControl display="flex" alignItems="center" w="auto">
              <FormLabel htmlFor="show-related" mb="0" fontSize="sm">
                Mostrar USs Relacionadas
              </FormLabel>
              <Switch
                id="show-related"
                isChecked={showRelatedUSs}
                onChange={(e) => setShowRelatedUSs(e.target.checked)}
                colorScheme="blue"
              />
            </FormControl>
          )}
        </HStack>

        {/*  NEW: User Stories da Sprint (Direct) */}
        {m.directUserStories.length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title={`User Stories da Sprint (${m.directUserStories.length})`} >
              <TableComponent data={m.directUserStories} headers={userStoryTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {/* NEW: User Stories Relacionadas (de outras sprints) */}
        {showRelatedUSs && m.relatedUserStories.length > 0 && (
          <Accordion allowToggle >
            <AccordionSection
              title={`User Stories Relacionadas - Outras Sprints (${m.relatedUserStories.length})`}
            >
              <Box mb={4} p={3} bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200">
                <Text fontSize="sm" color="orange.800">
                  <Icon as={MdList} display="inline" mr={2} />
                  Estas User Stories não fazem parte desta sprint, mas possuem tasks que estão nela.
                </Text>
              </Box>
              <TableComponent data={m.relatedUserStories} headers={userStoryTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {m.defects.length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Defects">
              <TableComponent data={m.defects} headers={bugTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {m.problems.length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Problems">
              <TableComponent data={m.problems} headers={bugTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {m.bugs.length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Bugs">
              <TableComponent data={m.bugs} headers={bugTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {m.taskItems.length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Tasks">
              <TableComponent data={m.taskItems} headers={userStoryTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}
      </VStack>
    );
  };

  return (
    <TeamsProvider>
      <Box w="100%" minH="100%">
        <Box w="100%" px={{ base: 4, md: 6, lg: 8 }}>
          <VStack spacing={8} align="stretch" py={6}>
            <Box p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" position="relative" overflow="visible" zIndex={1}>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="100%">
                  <Box data-testid="team-selector" position="relative" zIndex={30}>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.700">
                      Selecionar Time
                    </Text>
                    {/* @ts-ignore: Temporarily ignoring type check until Child Refactor */}
                    <ModernTeamSelect
                      onTeamSelected={handleTeamSelect}
                    />
                  </Box>

                  {sprintTeam && (
                    <Box data-testid="sprint-selector" position="relative" zIndex={29}>
                      <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.700">
                        Selecionar Sprint
                      </Text>
                      {/* @ts-ignore: Temporarily ignoring type check until Child Refactor */}
                      <ModernSelectSprintForm
                        teamId={sprintTeam}
                        sprint={sprint}
                        onSprintSelected={handleSprintSelect}
                        isLoading={isLoadingReport}
                      />
                    </Box>
                  )}
                </SimpleGrid>

                {sprintTeam && (
                  <Box p={6} bg="blue.50" borderRadius="xl" border="2px solid" borderColor="blue.200">
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
        </Box>
      </Box>
    </TeamsProvider>
  );
}
