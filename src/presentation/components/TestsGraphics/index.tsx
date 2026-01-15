import { Flex } from "@chakra-ui/react";
import { PipelineProvider } from "../../contexts/PipelineContext";
import TestsGraphic from "../TestsGraphic";
// import { withSession } from "../../../services/auth/session";

export default function TestsGraphics() {

  return (
    <>
      <PipelineProvider>
        <Flex direction="column" h="100vh">
          <TestsGraphic />
        </Flex>
      </PipelineProvider>
    </>

  );
}