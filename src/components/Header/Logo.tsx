import { Text } from "@chakra-ui/react";

export function Logo() {
  return (
    <Text as="a" href="/home" fontSize={["0.5xl", "1xl"]} fontWeight="bold" letterSpacing="right" w="64" mt="4" pl="2" color="rgb(0, 120, 212)">
      Azure Metrics
    </Text>
  );
}
