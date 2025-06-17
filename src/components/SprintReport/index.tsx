
import React, { useState } from "react";
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
} from "@chakra-ui/react";
import {
  MdDashboard,
  MdList
} from "react-icons/md";

import { TeamsProvider } from "../../contexts/TeamsContext";
import ModernSelectSprintForm from "../SelectSprintForm/ModernSelectSprintForm";
import ModernTeamSelect from "../TeamSelect/ModernTeamSelect";
import ModernEmptyState from "../EmptyState/ModernEmptyState";
import Report from "../../data/report";
import { SpinnerContent } from "../Spinner";
import SprintReportCards from "./SprintReportCards";
import { DetailedStatistics } from "./DetailedStatistics";
import SprintAlert from "./SprintAlert";
import PercentSprintReportCard from "./PecentSprintReportCard";
import SprintStateItens from "./SprintStateItens";
import SprintProgressItem from "./SprintProgressItem";
import { Task } from "../../types/Task";
import TableComponent from "../TableComponent";
import { AccordionSection } from "../AccordionSection";
import ReportTabs from "../ReportTabs";

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


export default function CompleteDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintTeam, setSprintTeam] = useState<Team>();
  const [sprint, setSprint] = useState<Iterations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const media = 100
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const report = new Report();
  const sprintData = report.returnSprintData(tasks);

  const userStoryTableHeaders = [
    "ID",
    "Title",
    "State",
    "Assigned To",
    "Reason",
    "Priority"
  ];


  const bugTableHeaders = [
    "ID",
    "Title",
    "State",
    "Assigned To",
    "Reason",
    "Priority",
    "Severity"
  ];

  const renderContent = () => {
    if (isLoading) {
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
            // Scroll para o seletor de time
            document.querySelector('[data-testid="team-selector"]')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}
        />
      );
    }

    if (tasks.length === 0) {
      return (
        <ModernEmptyState
          type="no-results"
          title="Sprint sem Dados"
          description="A sprint selecionada não possui itens de trabalho ou ainda não foi iniciada. Tente selecionar uma sprint diferente."
          actionLabel="Selecionar Outra Sprint"
          onAction={() => {
            // Scroll para o seletor de sprint
            document.querySelector('[data-testid="sprint-selector"]')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}
        />
      );
    }

    return (
      <VStack spacing={8} align="stretch" w="100%">
        <SprintAlert bugs={sprintData.bugs} defects={sprintData.defects} problems={sprintData.problems} totalStoryPoints={sprintData.totalStoryPoints} completedStoryPoints={sprintData.completedStoryPoints} />
        <SprintReportCards userStories={sprintData.userStories} bugs={sprintData.bugs} defects={sprintData.defects} problems={sprintData.problems} totalStoryPoints={sprintData.totalStoryPoints} completedStoryPoints={sprintData.completedStoryPoints} tasks={tasks} />
        <DetailedStatistics userStories={sprintData.userStories} bugs={sprintData.bugs} defects={sprintData.defects} problems={sprintData.problems} taskItems={sprintData.taskItems} totalStoryPoints={sprintData.totalStoryPoints} />
        <PercentSprintReportCard userStories={sprintData.userStories} userStoriesRate={sprintData.userStoriesRate} bugs={sprintData.bugs} defects={sprintData.defects} problems={sprintData.problems} totalStoryPoints={sprintData.totalStoryPoints} media={media} />
        <SprintStateItens userStories={sprintData.userStories} bugs={sprintData.bugs} defects={sprintData.defects} problems={sprintData.problems} taskItems={sprintData.taskItems} userStoryStatesData={sprintData.userStoryStatesData} bugStatesData={sprintData.bugStatesData} defectStatesData={sprintData.defectStatesData} problemsStateData={sprintData.problemsStateData} taskStatesData={sprintData.taskStatesData} />

        <Divider />

        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 4, md: 6 }}
          w="100%"
        >
          <SprintProgressItem title="Progresso por User Story" itemPorcentage={sprintData.usRate} completed_itens={sprintData.completedUserStories} total={sprintData.userStories.length} color="blue" />
          <SprintProgressItem title="Progresso por Story Points" itemPorcentage={sprintData.storyPointsRate} completed_itens={sprintData.completedStoryPoints} total={sprintData.totalStoryPoints} color="purple" />
          <SprintProgressItem title="Progresso por Defects" itemPorcentage={sprintData.defectsRate} completed_itens={sprintData.completedDefects} total={sprintData.defects.length} color="orange" />
          <SprintProgressItem title="Progresso por Bugs" itemPorcentage={sprintData.bugsRate} completed_itens={sprintData.completedBugs} total={sprintData.bugs.length} color="red" />
          <SprintProgressItem title="Progresso por Problems" itemPorcentage={sprintData.problemsRate} completed_itens={sprintData.completedProblems} total={sprintData.problems.length} color="red" />
          <SprintProgressItem title="Progresso por Tasks" itemPorcentage={sprintData.tasksItensRate} completed_itens={sprintData.completedTasksItems} total={sprintData.taskItems.length} color="green" />
          <SprintProgressItem title="Progresso por Itens" itemPorcentage={sprintData.completionRate} completed_itens={sprintData.completedTasks.length} total={tasks.length} color="gray" />
        </SimpleGrid>

        <Divider />


        <HStack>
          <Icon as={MdList} color="blue.500" boxSize={10} />
          <Text fontSize="x-large" fontWeight="semibold" color="gray.700">
            Listagem de itens da sprint
          </Text>
        </HStack>

        {report.returnUsersStories(tasks).length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="User Stories" >
              <TableComponent data={report.returnUsersStories(tasks)} headers={userStoryTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {report.returnDefects(tasks).length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Defects">
              <TableComponent data={report.returnDefects(tasks)} headers={bugTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {report.returnProblems(tasks).length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Problems">
              <TableComponent data={report.returnProblems(tasks)} headers={bugTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {report.returnBugs(tasks).length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Bugs">
              <TableComponent data={report.returnBugs(tasks)} headers={bugTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        {report.returnTaskItens(tasks).length > 0 && (
          <Accordion allowToggle >
            <AccordionSection title="Tasks">
              <TableComponent data={report.returnTaskItens(tasks)} headers={userStoryTableHeaders} />
            </AccordionSection>
          </Accordion>
        )}

        <Box>
          {/* <ReportTabs tasks={tasks} /> */}
        </Box>
      </VStack>
    );
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

                  {sprintTeam && (
                    <Box data-testid="sprint-selector" position="relative" zIndex={29}>
                      <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.700">
                        Selecionar Sprint
                      </Text>
                      <ModernSelectSprintForm
                        teamId={sprintTeam}
                        sprint={sprint}
                        setTasks={setTasks}
                        setIsLoading={setIsLoading}
                      />
                    </Box>
                  )}
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
