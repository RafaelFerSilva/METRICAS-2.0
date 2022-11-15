import { withSession } from "../services/auth/session";

import { Header } from "../components/Header";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import HomeMenu from "../components/HomeMenu";


export default function Home() {

  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"`}
      gridTemplateRows={'8vh 1fr 30px'}
      gridTemplateColumns={'47vh 1fr'}
      h='100vh'
    >
      <GridItem area={'header'}>
        <Header />
      </GridItem>
      <GridItem  mr="1" mt="0.5" bg="white" area={'nav'}>
        <HomeMenu />
      </GridItem>
      {/* <GridItem pl='2' bg="white" mt="0.5" area={'main'}>
        Main
      </GridItem> */}
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