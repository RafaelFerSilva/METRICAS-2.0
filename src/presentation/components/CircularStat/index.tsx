import { VStack, HStack, Badge, Progress, Box, Text, Center } from "@chakra-ui/react";

export function CircularStat({
    label,
    value,
    total,
    colorScheme = "blue"
  }: {
    label: string;
    value: number;
    total: number;
    colorScheme?: string;
  }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
  
    return (
      <Center>
        <VStack spacing={2}>
          <Box position="relative" display="inline-block">
            <Progress
              value={percentage}
              colorScheme={colorScheme}
              size="lg"
              borderRadius="full"
              bg="gray.200"
              sx={{
                '& > div': {
                  borderRadius: 'full',
                }
              }}
            />
            <Center position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
              <VStack spacing={0}>
                <Text fontSize="xl" fontWeight="bold" color={`${colorScheme}.500`}>
                  {value}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  de {total}
                </Text>
              </VStack>
            </Center>
          </Box>
          <Text fontSize="sm" fontWeight="medium" textAlign="center">
            {label}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {Math.round(percentage)}%
          </Text>
        </VStack>
      </Center>
    );
  }
