import { withSession } from "../services/auth/session";
import { Header } from "../components/Header";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import HomeMenu from "../components/HomeMenu";
import TestsReport from "../components/TestsReport";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";

export default function TestsReportPage() {
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
          <Box borderRadius="md" boxShadow="md">
            <TestsReport />
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