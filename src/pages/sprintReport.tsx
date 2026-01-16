import { Grid, GridItem, Box, Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "../presentation/hooks/useAuth";
import HomeMenu from "../presentation/components/HomeMenu";
import SprintReport from "../presentation/components/SprintReport";
import { SidebarDrawerProvider, useSidebarDrawer } from "../presentation/contexts/SidebarDraweContext";

export default function SprintReportPage() {
  const { isLoading } = useAuth();
  // SidebarDraweLogic is provided by the wrapper, but we need to access context inside it?
  // Actually, Grid is inside the provider. We need a child component or access context here.
  // Wait, SidebarDrawerProvider wraps the Grid. So useSidebarDrawer won't work OUTSIDE, or we need to move Provider up?
  // Inspecting file structure: SidebarDrawerProvider wraps Grid. 
  // We can't use useSidebarDrawer hook inside the same component that renders the Provider.
  // We should create a Layout wrapper or move Provider to _app.tsx.
  // For now, let's create a wrapper component inside this file to consume context.

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <SidebarDrawerProvider>
      <SprintReportLayout />
    </SidebarDrawerProvider>
  );
}

function SprintReportLayout() {
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
        <Box borderRadius="md" boxShadow="md" minH="100%">
          <SprintReport />
        </Box>
      </GridItem>
    </Grid>
  );
}

