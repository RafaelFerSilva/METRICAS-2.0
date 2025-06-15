import { Flex, VStack, Spinner, Text } from "@chakra-ui/react";

export function SpinnerContent({ text, minH = "400px" }: { text: string; minH?: string }) {
    return (
        <Flex justify="center" align="center" minH={minH}>
            <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text color="gray.600">{text}</Text>
            </VStack>
        </Flex>
    )
}