import { Grid, GridItem, Box, Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "../presentation/hooks/useAuth";
import HomeMenu from "../components/HomeMenu";
import AllTestsGraphics from "../components/AllTestsCases";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";

export default function AllTestsCasesPage() {
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
      <Grid
        templateAreas={`"nav main"`}
        gridTemplateColumns={{ base: '1fr', lg: '256px 1fr' }}
        height="100vh"
      >
        <GridItem area={'nav'} bg="gray.50" p={0}>
          <HomeMenu />
        </GridItem>

        <GridItem area={'main'} bg="white" p={4}>
          <Box borderRadius="md" boxShadow="md">
            <AllTestsGraphics />
          </Box>
        </GridItem>
      </Grid>
    </SidebarDrawerProvider>
  );
}
