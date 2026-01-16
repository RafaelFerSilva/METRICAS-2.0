import { Grid, GridItem, Box, Heading, Text, Center, Spinner } from "@chakra-ui/react";
import HomeMenu from "../presentation/components/HomeMenu";
import { SidebarDrawerProvider, useSidebarDrawer } from "../presentation/contexts/SidebarDraweContext";
import { useAuth } from "../presentation/hooks/useAuth";

export default function Dashboard() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <SidebarDrawerProvider>
      <DashboardLayout />
    </SidebarDrawerProvider>
  );
}

function DashboardLayout() {
  const { isCollapsed } = useSidebarDrawer();
  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={{ base: '1fr', lg: isCollapsed ? '80px 1fr' : '256px 1fr' }}
      height="100vh"
      transition="grid-template-columns 0.3s ease-in-out"
    >
      <GridItem area={'nav'} bg="gray.50" p={0}>
        <HomeMenu />
      </GridItem>

      <GridItem area={'main'} bg="white" p={4} overflow="auto">
        <Box borderRadius="md" boxShadow="md" p={6} minH="100%">
          <Heading size="lg" mb={4} color="blue.600">
            Dashboard
          </Heading>
          <Text mb={4}>
            Bem-vindo ao Dashboard de Métricas do Azure DevOps!
          </Text>
          <Text color="gray.600">
            Selecione uma das opções no menu lateral para visualizar os relatórios e métricas disponíveis.
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}