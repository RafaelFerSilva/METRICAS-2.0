import { withSession } from "../services/auth/session";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import HomeMenu from "../components/HomeMenu";
import SprintReport from "../components/SprintReport";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";

export default function SprintReportPage() {
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
            <SprintReport />
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