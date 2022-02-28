import { Box, Flex, Grid, Heading, SimpleGrid, Text } from "@chakra-ui/react";

export function Summary(props: {
  sprintTasks: number;
  sprintPoints: any;
  resolvedTasks: number;
  unresolvedTasks: number;
  resolvedPoints: number;
  unresolvedPoints: number;
  bugs: number;
  melhorias: number;
}) {
  return (
    <SimpleGrid columns={[2, null, 3]} spacing='40px' mb="3">
      <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Stories na Sprint
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.sprintTasks}</strong>
        </Text>
      </Box>

      {/* <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Stories Finalizadas
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.resolvedTasks}</strong>
        </Text>
      </Box> */}

      {/* <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Stories Para Finalizar
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.unresolvedTasks}</strong>
        </Text>
      </Box> */}

      <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Pontos da Sprint
          {/* <span><TimelineRoundedIcon sx={{ fontSize: 30 }} /></span> */}
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.sprintPoints}</strong>
        </Text>
      </Box>

      {/* <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Pontos Entregues
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.resolvedPoints}</strong>
        </Text>
      </Box> */}

      {/* <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Pontos Para Entregar
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.unresolvedPoints}</strong>
        </Text>
      </Box> */}

      <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Bugs
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.bugs}</strong>
        </Text>
      </Box>

      {/* <Box borderRadius="8" bg="AliceBlue" maxWidth={370}>
        <Heading bg="PowderBlue" borderTopRadius="8" p="3" textAlign="center" fontSize="30">
          Melhorias
        </Heading>
        <Text textAlign="center" fontSize="30">
          <strong>{props.melhorias}</strong>
        </Text>
      </Box> */}
    </SimpleGrid>
  );
}
