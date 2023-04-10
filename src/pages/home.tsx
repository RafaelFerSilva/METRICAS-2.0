import { withSession } from "../services/auth/session";

import { Header } from "../components/Header";
import { Grid, GridItem } from "@chakra-ui/react";
import HomeMenu from "../components/HomeMenu";
import { useState } from "react";
import SprintReport from "../components/SprintReport";
import TestsReport from "../components/TestsReport";
import TestsGraphics from "../components/TestsGraphics";
import SprintCompare from "../components/SprintCompare";

export default function Home() {
  const [renderComponent, setRenderComponent] = useState("Sprint Report")

  return (
    <Grid
      templateAreas={`"header header" "nav main"`}
      gridTemplateRows={'8vh 1fr 30px'}
      gridTemplateColumns={'37vh 1fr'}
    >
      <GridItem area={'header'}>
        <Header />
      </GridItem>
      <GridItem mr="1" mt="0.2" bg="white" area={'nav'}>
        <HomeMenu setRenderComponent={setRenderComponent} />
      </GridItem>
      <GridItem area={'nav main"'}>
        {renderComponent === "Sprint Report" && <SprintReport />}
        {renderComponent === "Sprints Compare" && <SprintCompare />}
        {renderComponent === "Runs Report" && <TestsReport />}
        {renderComponent === "Tests Graphics" && <TestsGraphics />}
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