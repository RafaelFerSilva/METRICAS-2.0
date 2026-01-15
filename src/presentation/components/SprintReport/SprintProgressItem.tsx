import { Badge, Box, Flex, HStack, Progress, useColorModeValue, VStack, Text } from "@chakra-ui/react";

interface SprintProgressItemProps {
    title: string;
    itemPorcentage: number;
    completed_itens: number;
    total: number;
    color?: string;
}

export default function SprintProgressItem({title, itemPorcentage, completed_itens, total, color="gray"}: SprintProgressItemProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    return total > 0 ? (
        <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={`${color}.200`}
          >
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="semibold" color={`${color}.700`}>

                  {title}
                </Text>
                <Badge colorScheme={color} variant="subtle" fontSize="sm">
                  {itemPorcentage.toFixed(1)}%
                </Badge>
              </Flex>
              <Progress
                value={itemPorcentage}
                colorScheme={color}
                size="lg"
                borderRadius="md"
                bg={`${color}.100`}
              />
              <HStack justify="space-between" fontSize="sm" color={`${color}.600`}>
                <Text>{completed_itens} concluídos</Text>
                <Text>{total} total</Text>
              </HStack>
            </VStack>
          </Box>
    ): null
}