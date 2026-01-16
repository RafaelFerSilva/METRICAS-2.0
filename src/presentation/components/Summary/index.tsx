import { Box, Flex, Grid, Heading, SimpleGrid, Text } from "@chakra-ui/react";

export function Summary(props: {
  sprintTasks: number;
  sprintPoints: any;
  resolvedTasks: number;
  unresolvedTasks: number;
  resolvedPoints: number;
  unresolvedPoints: number;
  bugs: number;
}) {
  return (
    <SimpleGrid columns={[2, null, 3]} spacing='250px' mb="3">
      <Box borderRadius="8" bg="AliceBlue" maxWidth={270} height="100">
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="20">
          Stories in Sprint
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.sprintTasks}</strong>
        </Text>
      </Box>

      <Box borderRadius="8" bg="AliceBlue" maxWidth={270} height="100">
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="20">
          Sprint Points
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.sprintPoints}</strong>
        </Text>
      </Box>

      <Box borderRadius="8" bg="AliceBlue" maxWidth={270} height="100">
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="20">
          Bugs
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.bugs}</strong>
        </Text>
      </Box>
    </SimpleGrid>
  );
}
