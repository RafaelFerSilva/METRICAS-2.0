import { Text } from "@chakra-ui/react";

export function Logo() {
  return (
    <Text as="a" href="/home" fontSize={24} fontWeight="bold" letterSpacing="right" w="64" mt="2" pl="3" color="rgb(0, 120, 212)">
      Azure Metrics
    </Text>
  );
}
