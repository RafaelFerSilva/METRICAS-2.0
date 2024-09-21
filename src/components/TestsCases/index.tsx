import { Flex, Box, Center, Text } from "@chakra-ui/react";
import { TestPlainContext, TestPlainProvider } from "../../contexts/TestPlainContext";
import TestPlanSelect from "../TestPlanSelect";
import TestSuiteSelect from "../TestSuiteSelect";
import TestCaseReport from "../TestCaseReport";
import { useState } from "react";
import Loading from '../Loading';

export default function TestsGraphics() {
  const [suites, setSuites] = useState<any[]>([])
  const [testsCases, setTestsCases]= useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const renderGraphic = () => {
    if ( testsCases !== undefined && testsCases.length > 0) {
        return (
          <>
            <TestCaseReport testsCases={testsCases} />
          </>
        )    
    }
  }

  return (  
    <>
      <TestPlainProvider>
          <Flex direction="column" h="100vh">
          <Box display="flex" mt="1px" bg="white" p={3} gap={5}>
            <TestPlanSelect setSuites={setSuites} setTestsCases={setTestsCases} />
            {suites && < TestSuiteSelect setTestsCases={setTestsCases} suites={suites} setIsLoading={setIsLoading} />}
          </Box>
          <Box display="grid" mt="1px" bg="white" p={3} gap={5} >
            {isLoading ? <Center height="100%" mt="20px">< Loading color='blue' type='spin' /></Center> : renderGraphic()}
          </Box>
          </Flex>
      </TestPlainProvider>
    </>

  );
}
