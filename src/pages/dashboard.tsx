import { withSession } from "../services/auth/session";
import { Header } from "../components/Header";
import { Grid, GridItem, Box, Heading, Text } from "@chakra-ui/react";
import HomeMenu from "../components/HomeMenu";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";

export default function Dashboard() {
  return (
    <SidebarDrawerProvider>
      <Grid
        templateAreas={`"header header" "nav main"`}
        gridTemplateRows={'8vh 1fr'}
        gridTemplateColumns={{ base: '1fr', lg: '256px 1fr' }}
        height="100vh"
      >
        <GridItem area={'header'}>
          <Header />
        </GridItem>

        <GridItem area={'nav'} bg="gray.50" p={0}>
          <HomeMenu />
        </GridItem>

        <GridItem area={'main'} bg="white" p={4}>
          <Box borderRadius="md" boxShadow="md" p={6}>
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
    </SidebarDrawerProvider>
  );
}

export const getServerSideProps = withSession((ctx: any) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});