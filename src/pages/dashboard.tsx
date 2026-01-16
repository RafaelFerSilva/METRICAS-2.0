import { Grid, GridItem, Box, Heading, Text, Center, Spinner, SimpleGrid, Icon, Flex, useColorModeValue, Container, Button } from "@chakra-ui/react";
import HomeMenu from "../presentation/components/HomeMenu";
import { SidebarDrawerProvider, useSidebarDrawer } from "../presentation/contexts/SidebarDraweContext";
import { useAuth } from "../presentation/hooks/useAuth";
import { MdReport, MdTrendingUp, MdAssessment, MdArrowForward } from "react-icons/md";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Dashboard() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" emptyColor="gray.200" />
      </Center>
    );
  }

  return (
    <SidebarDrawerProvider>
      <Head>
        <title>Dashboard | Azure Metrics</title>
      </Head>
      <DashboardLayout />
    </SidebarDrawerProvider>
  );
}

function DashboardLayout() {
  const { isCollapsed } = useSidebarDrawer();
  const router = useRouter();

  // Premium Colors
  const bgGradient = useColorModeValue("linear(to-br, gray.50, gray.100)", "linear(to-br, gray.900, black)");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  const modules = [
    {
      title: "Sprint Report",
      description: "Acompanhe o progresso detalhado da sprint atual, burndown e status das User Stories.",
      icon: MdReport,
      color: "blue.500",
      bgFrom: "blue.50",
      bgTo: "blue.100",
      route: "/sprintReport"
    },
    {
      title: "Sprint Trends",
      description: "Análise histórica de Cycle Time, Lead Time e eficiência do fluxo de trabalho.",
      icon: MdTrendingUp,
      color: "purple.500",
      bgFrom: "purple.50",
      bgTo: "purple.100",
      route: "/sprintTrends"
    },
    {
      title: "Test Cases",
      description: "Gestão completa da qualidade, cobertura de testes e relatórios de automação.",
      icon: MdAssessment,
      color: "green.500",
      bgFrom: "green.50",
      bgTo: "green.100",
      route: "/alltestsCases"
    },
  ];

  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={{ base: '1fr', lg: isCollapsed ? '80px 1fr' : '256px 1fr' }}
      height="100vh"
      transition="grid-template-columns 0.3s ease-in-out"
      overflow="hidden"
    >
      <GridItem area={'nav'} bg="white" zIndex="sticky">
        <HomeMenu />
      </GridItem>

      <GridItem area={'main'} bgGradient={bgGradient} overflowY="auto" position="relative">

        <Container maxW="full" py={12} px={8}>

          {/* Hero Header */}
          <Box mb={16}>
            <Text color="blue.500" fontWeight="bold" fontSize="sm" letterSpacing="wide" textTransform="uppercase" mb={2}>
              Visão Geral
            </Text>
            <Heading as="h1" size="2xl" mb={4} color={headingColor} letterSpacing="tight">
              Olá, Bem-vindo de volta! 👋
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl">
              Aqui está o resumo dos seus indicadores. Selecione um módulo abaixo para análises detalhadas.
            </Text>
          </Box>

          {/* Quick Access Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {modules.map((module) => (
              <Box
                key={module.title}
                bg={cardBg}
                borderRadius="2xl"
                p={8}
                boxShadow="lg"
                transition="all 0.3s ease"
                cursor="pointer"
                onClick={() => router.push(module.route)}
                position="relative"
                overflow="hidden"
                role="group"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "2xl",
                }}
              >
                {/* Decorative Background Icon */}
                <Icon
                  as={module.icon}
                  position="absolute"
                  right="-20px"
                  bottom="-20px"
                  boxSize="160px"
                  color={module.color}
                  opacity="0.05"
                  _groupHover={{ transform: "scale(1.1) rotate(10deg)", opacity: "0.1" }}
                  transition="all 0.4s"
                />

                <Flex
                  w={16}
                  h={16}
                  bgGradient={`linear(to-br, ${module.bgFrom}, ${module.bgTo})`}
                  color={module.color}
                  align="center"
                  justify="center"
                  borderRadius="2xl"
                  mb={6}
                  boxShadow="md"
                >
                  <Icon as={module.icon} boxSize={8} />
                </Flex>

                <Heading size="md" mb={4} color={headingColor}>
                  {module.title}
                </Heading>

                <Text color={textColor} mb={8} lineHeight="tall">
                  {module.description}
                </Text>

                <Flex align="center" color={module.color} fontWeight="bold" fontSize="sm">
                  <Text mr={2}>Acessar</Text>
                  <Icon as={MdArrowForward} transition="transform 0.2s" _groupHover={{ transform: "translateX(5px)" }} />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>

        </Container>
      </GridItem>
    </Grid>
  );
}