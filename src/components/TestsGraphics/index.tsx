import { Flex } from "@chakra-ui/react";
import { PipelineProvider } from "../../contexts/PipelineContext";
import { AllRunsProvider } from "../../contexts/AllRunsContext";
import TestsGraphic from "../../components/TestsGraphic";
// import { withSession } from "../../services/auth/session";

export default function TestsGraphics() {

  return (
    <>
      <PipelineProvider>
        <AllRunsProvider>
          <Flex direction="column" h="100vh">
            <TestsGraphic />
          </Flex>
        </AllRunsProvider>
      </PipelineProvider>
    </>

  );
}

// Decorator Pattern
// export const getServerSideProps = withSession((ctx: any) => {
//   return {
//     props: {
//       session: ctx.req.session,
//     },
//   };
// });
