import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  Badge,
  Icon,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  MdAssignment,
  MdBugReport,
  MdCheckCircle,
  MdAccessTime,
} from "react-icons/md";
import { MetricCard, ChartCard } from "../ModernCard";

interface Task {
  id: string;
  title: string;
  state: string;
  workItemType: string;
  storyPoints?: number;
  assignedTo?: string;
  tags?: string[];
}

interface SprintDashboardProps {
  tasks: Task[];
  isLoading?: boolean;
  sprintName?: string;
  teamName?: string;
}

export default function SprintDashboard({ 
  tasks, 
  isLoading = false, 
  sprintName = "Sprint Atual",
  teamName = "Time"
}: SprintDashboardProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Calcular métricas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => 
    task.state === 'Done' || task.state === 'Closed'
  ).length;
  const inProgressTasks = tasks.filter(task => 
    task.state === 'Active' || task.state === 'In Progress'
  ).length;
  const bugs = tasks.filter(task => 
    task.workItemType === 'Bug'
  ).length;
  const userStories = tasks.filter(task => 
    task.workItemType === 'User Story'
  ).length;
  
  const totalStoryPoints = tasks.reduce((sum, task) => 
    sum + (task.storyPoints || 0), 0
  );
  const completedStoryPoints = tasks
    .filter(task => task.state === 'Done' || task.state === 'Closed')
    .reduce((sum, task) => sum + (task.storyPoints || 0), 0);

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const storyPointsRate = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;

  // Dados para gráficos
  const tasksByState = [
    { label: 'Concluídas', value: completedTasks, color: 'green' },
    { label: 'Em Progresso', value: inProgressTasks, color: 'blue' },
    { label: 'Pendentes', value: totalTasks - completedTasks - inProgressTasks, color: 'orange' },
  ];

  const tasksByType = [
    { label: 'User Stories', value: userStories, color: 'blue' },
    { label: 'Bugs', value: bugs, color: 'red' },
    { label: 'Outros', value: totalTasks - userStories - bugs, color: 'purple' },
  ];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Carregando dados do sprint...</Text>
        </VStack>
      </Flex>
    );
  }

  if (totalTasks === 0) {
    return (
      <Alert status="info" borderRadius="lg" bg={cardBg}>
        <AlertIcon />
        <Box>
          <AlertTitle>Nenhum item encontrado!</AlertTitle>
          <AlertDescription>
            Este sprint não possui itens de trabalho ou ainda não foi iniciado.
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" overflowX="hidden">
      <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={8} align="stretch" py={6}>
          {/* Header */}
          <Box>
            <Heading size="lg" color="gray.800" mb={2}>
              Dashboard - {sprintName}
            </Heading>
            <Text color="gray.600" fontSize="md">
              {teamName} • {totalTasks} itens no total
            </Text>
          </Box>

          {/* Métricas Principais */}
          <SimpleGrid 
            columns={{ base: 1, sm: 2, lg: 4 }} 
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            <MetricCard
              title="Total de Itens"
              value={totalTasks}
              icon={MdAssignment}
              colorScheme="blue"
            />
            <MetricCard
              title="Concluídos"
              value={completedTasks}
              change={completionRate > 50 ? 15 : -5}
              icon={MdCheckCircle}
              colorScheme="green"
            />
            <MetricCard
              title="Em Progresso"
              value={inProgressTasks}
              icon={MdAccessTime}
              colorScheme="orange"
            />
            <MetricCard
              title="Bugs"
              value={bugs}
              change={bugs > 5 ? -10 : 5}
              icon={MdBugReport}
              colorScheme="red"
            />
          </SimpleGrid>

          {/* Progresso Geral */}
          <SimpleGrid 
            columns={{ base: 1, lg: 2 }} 
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            <Box
              bg={cardBg}
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    Progresso por Itens
                  </Text>
                  <Badge colorScheme="blue" variant="subtle" fontSize="sm">
                    {completionRate.toFixed(1)}%
                  </Badge>
                </Flex>
                <Progress 
                  value={completionRate} 
                  colorScheme="blue" 
                  size="lg" 
                  borderRadius="md"
                  bg="gray.100"
                />
                <HStack justify="space-between" fontSize="sm" color="gray.600">
                  <Text>{completedTasks} concluídos</Text>
                  <Text>{totalTasks} total</Text>
                </HStack>
              </VStack>
            </Box>

            <Box
              bg={cardBg}
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    Progresso por Story Points
                  </Text>
                  <Badge colorScheme="purple" variant="subtle" fontSize="sm">
                    {storyPointsRate.toFixed(1)}%
                  </Badge>
                </Flex>
                <Progress 
                  value={storyPointsRate} 
                  colorScheme="purple" 
                  size="lg" 
                  borderRadius="md"
                  bg="gray.100"
                />
                <HStack justify="space-between" fontSize="sm" color="gray.600">
                  <Text>{completedStoryPoints} pontos</Text>
                  <Text>{totalStoryPoints} total</Text>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Gráficos */}
          <SimpleGrid 
            columns={{ base: 1, lg: 2 }} 
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            <ChartCard
              title="Distribuição por Status"
              subtitle="Visualização do progresso atual"
              colorScheme="blue"
            >
              <ModernBarChart 
                data={tasksByState}
                title="Itens por Status"
                colorScheme="blue"
              />
            </ChartCard>

            <ChartCard
              title="Distribuição por Tipo"
              subtitle="Tipos de itens no sprint"
              colorScheme="purple"
            >
              <ModernBarChart 
                data={tasksByType}
                title="Itens por Tipo"
                colorScheme="purple"
              />
            </ChartCard>
          </SimpleGrid>

          {/* Estatísticas Detalhadas */}
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 3 }} 
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            <Box
              bg={cardBg}
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <Stat>
                <StatLabel color="gray.600">Taxa de Conclusão</StatLabel>
                <StatNumber color="green.500" fontSize="2xl">
                  {completionRate.toFixed(1)}%
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={completionRate > 50 ? 'increase' : 'decrease'} />
                  {completionRate > 50 ? 'Acima da média' : 'Abaixo da média'}
                </StatHelpText>
              </Stat>
            </Box>

            <Box
              bg={cardBg}
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <Stat>
                <StatLabel color="gray.600">Story Points Médios</StatLabel>
                <StatNumber color="blue.500" fontSize="2xl">
                  {userStories > 0 ? (totalStoryPoints / userStories).toFixed(1) : '0'}
                </StatNumber>
                <StatHelpText>
                  Por User Story
                </StatHelpText>
              </Stat>
            </Box>

            <Box
              bg={cardBg}
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <Stat>
                <StatLabel color="gray.600">Densidade de Bugs</StatLabel>
                <StatNumber color="red.500" fontSize="2xl">
                  {totalTasks > 0 ? ((bugs / totalTasks) * 100).toFixed(1) : '0'}%
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={bugs < totalTasks * 0.1 ? 'increase' : 'decrease'} />
                  {bugs < totalTasks * 0.1 ? 'Baixa' : 'Alta'}
                </StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

// Componente para gráfico de barras moderno
function ModernBarChart({ 
  data, 
  title, 
  colorScheme = "blue" 
}: {
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  colorScheme?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  if (maxValue === 0) {
    return (
      <Flex justify="center" align="center" h="200px">
        <VStack spacing={3}>
          <Icon as={MdAssignment} boxSize={8} color="gray.400" />
          <Text color="gray.500" fontSize="sm">
            Nenhum dado disponível
          </Text>
        </VStack>
      </Flex>
    );
  }
  
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" fontWeight="semibold" color="gray.600" textAlign="center">
        {title}
      </Text>
      <VStack spacing={3} align="stretch">
        {data.map((item, index) => (
          <Box key={index}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium">
                {item.label}
              </Text>
              <Badge 
                colorScheme={item.color || colorScheme} 
                variant="solid"
                borderRadius="full"
                px={3}
              >
                {item.value}
              </Badge>
            </HStack>
            <Progress 
              value={maxValue > 0 ? (item.value / maxValue) * 100 : 0}
              colorScheme={item.color || colorScheme}
              size="md"
              borderRadius="md"
              bg="gray.100"
            />
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}