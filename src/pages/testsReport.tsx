import { Grid, GridItem, Box, Center, Spinner, Heading, Text, useColorModeValue, Container, Flex, Icon } from "@chakra-ui/react";
import { useAuth } from "../presentation/hooks/useAuth";
import HomeMenu from "../presentation/components/HomeMenu";
import TestsReport from "../presentation/components/TestsReport";
import { SidebarDrawerProvider, useSidebarDrawer } from "../presentation/contexts/SidebarDraweContext";
import Head from "next/head";
import { MdReport } from "react-icons/md";

export default function TestsReportPage() {
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
        <title>Tests Report | Azure Metrics</title>
      </Head>
      <TestsReportLayout />
    </SidebarDrawerProvider>
  );
}

function TestsReportLayout() {
  const { isCollapsed } = useSidebarDrawer();

  // Premium Colors
  const bgGradient = useColorModeValue("linear(to-br, gray.50, gray.100)", "linear(to-br, gray.900, black)");
  const headingColor = useColorModeValue("gray.800", "white");

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
        <Container maxW="full" py={8} px={8}>

          {/* Page Header */}
          <Flex align="center" mb={10}>
            <Flex
              w={12}
              h={12}
              align="center"
              justify="center"
              bgGradient="linear(to-br, orange.400, orange.600)"
              color="white"
              borderRadius="xl"
              boxShadow="md"
              mr={4}
            >
              <Icon as={MdReport} boxSize={6} />
            </Flex>
            <Box>
              <Heading size="lg" color={headingColor} letterSpacing="tight">Tests Report</Heading>
              <Text color="gray.500" fontSize="sm">Relatório detalhado de execuções de teste</Text>
            </Box>
          </Flex>

          {/* Content Module */}
          <Box borderRadius="2xl" boxShadow="none" minH="100%">
            <TestsReport />
          </Box>
        </Container>
      </GridItem>
    </Grid>
  );
}
