import { withSession } from "../services/auth/session";
import { Header } from "../components/Header";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import HomeMenu from "../components/HomeMenu";
import { useState } from "react";
import SprintReport from "../components/SprintReport";
import TestsReport from "../components/TestsReport";
import TestsGraphics from "../components/TestsGraphics";
import SprintCompare from "../components/SprintCompare";
import AllTestsGraphics from "../components/AllTestsCases";

export default function Home() {
  const [renderComponent, setRenderComponent] = useState("Sprint Report");
  const [isOpen, setIsOpen] = useState(true); // Controle de visibilidade do menu

  return (
    <Grid
      templateAreas={`"header header" "nav main"`}
      gridTemplateRows={'8vh 1fr'}
      gridTemplateColumns={isOpen ? '250px 1fr' : '50px 1fr'} // Ajusta o tamanho do menu
      height="100vh" // Preenche a altura total da tela
    >
      <GridItem area={'header'}>
        <Header />
      </GridItem>

      <GridItem area={'nav'} bg="gray.50" p={0}>
        <HomeMenu setRenderComponent={setRenderComponent} isOpen={isOpen} setIsOpen={setIsOpen} />
      </GridItem>

      <GridItem area={'main'} bg="white" p={4}>
        <Box borderRadius="md" boxShadow="md">
          {renderComponent === "Sprint Report" && <SprintReport />}
          {renderComponent === "Comparison of Sprints" && <SprintCompare />}
          {renderComponent === "Runs Report" && <TestsReport />}
          {renderComponent === "Tests Graphics" && <TestsGraphics />}
          {renderComponent === "Tests Cases" && <AllTestsGraphics />}
        </Box>
      </GridItem>
    </Grid>
  );
}

// Decorator Pattern
export const getServerSideProps = withSession((ctx: any) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});
