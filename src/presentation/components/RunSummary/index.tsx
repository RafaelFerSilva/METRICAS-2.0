import {
  Box,
  Center,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  Button
} from '@chakra-ui/react';
import { CheckIcon, WarningTwoIcon, InfoIcon, ArrowRightIcon } from '@chakra-ui/icons';

interface RunsCondensedData {
  id: string;
  name: string;
  startedDate: string;
  completedDate: string;
  state: string;
  build: string;
  pipelineId: string;
  totalTests: string;
  passedTests: string;
  incompleteTests: string;
  unanalyzedTests: string;
  notApplicableTests: string;
  postProcessState: string;
  url: string;
}

interface ItemProsps {
  runCondensedData: RunsCondensedData;
}

export default function RunSummary(runCondensedData: ItemProsps) {

  return (
    <>
      {runCondensedData.runCondensedData && (
        <Center py={2}>
          <Box
            maxW={'250px'}
            w={'full'}
            bg={'white'}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}>
            <Stack
              textAlign={'center'}
              p={2}
              color={'gray.800'}
              align={'center'}>
              <Text
                fontSize={'xs'}
                fontWeight={500}
                bg={'green.50'}
                px={3}
                color={'green.500'}
                rounded={'full'}>
                RUN
              </Text>
              <Stack direction={'row'} align={'center'} justify={'center'}>
                <Text fontSize={'lg'} fontWeight={800}>
                  {runCondensedData.runCondensedData.build}
                </Text>
              </Stack>
            </Stack>

            <Box bg={'gray.50'} px={6} py={3}>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.400" />
                  Passed: {runCondensedData.runCondensedData.passedTests}
                </ListItem>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="red.400" />
                  Failed: {runCondensedData.runCondensedData.unanalyzedTests}
                </ListItem>
                <ListItem>
                  <ListIcon as={InfoIcon} color="green.400" />
                  Skipped: {runCondensedData.runCondensedData.notApplicableTests}
                </ListItem>
                <ListItem>
                  <ListIcon as={ArrowRightIcon} color="blue.400" />
                  All Tests: {runCondensedData.runCondensedData.totalTests}
                </ListItem>
              </List>
              <Button
                fontSize={"sm"}
                target='_blank'
                href={runCondensedData.runCondensedData.url}
                as="a"
                mt={5}
                w={'full'}
                bg={'green.400'}
                color={'white'}
                rounded={'xl'}
                boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                _hover={{
                  bg: 'green.500',
                }}
                _focus={{
                  bg: 'green.700',
                }}>
                Open Run
              </Button>
            </Box>
          </Box>
        </Center>
      )}
    </>

  )
}
