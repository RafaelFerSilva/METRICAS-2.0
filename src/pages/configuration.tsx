import { Grid, GridItem, Box, Center, Spinner, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../presentation/hooks/useAuth";
import HomeMenu from "../components/HomeMenu";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";

export default function ConfigurationPage() {
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
          <Box borderRadius="md" boxShadow="md" p={6}>
            <Heading size="lg" mb={4} color="blue.600">
              Configuration
            </Heading>
            <Text mb={4}>
              Bem-vindo ao painel de Configurações do Metrics Azure DevOps!
            </Text>
            {/* <Text color="gray.600">
              Selecione uma das opções no menu lateral para visualizar os relatórios e métricas disponíveis.
            </Text> */}
          </Box>
        </GridItem>
      </Grid>
    </SidebarDrawerProvider>
  );
}
