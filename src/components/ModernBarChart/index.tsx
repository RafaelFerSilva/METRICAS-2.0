import { VStack, HStack, Badge, Progress, Box, Text } from "@chakra-ui/react";
import { ChartSkeleton } from "../ChartSkeleton";
import { EmptyChart } from "../EmptyChart";

export function ModernBarChart({
    data,
    title,
    colorScheme = "blue",
    isLoading = false
  }: {
    data: Array<{ label: string; value: number; color?: string }>;
    title: string;
    colorScheme?: string;
    isLoading?: boolean;
  }) {
    if (isLoading) {
      return <ChartSkeleton height="250px" />;
    }
  
    if (!data || data.length === 0 || data.every(d => d.value === 0)) {
      return <EmptyChart title={title} height="250px" />;
    }
  
    const maxValue = Math.max(...data.map(d => d.value));
  
    return (
      <VStack spacing={4} align="stretch">
        <Text fontSize="sm" fontWeight="semibold" color="gray.600" textAlign="center">
          {title}
        </Text>
        <VStack spacing={3} align="stretch">
          {data.map((item, index) => (
            <Box key={index}>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  {item.label}
                </Text>
                <Badge
                  colorScheme={item.color || colorScheme}
                  variant="solid"
                  borderRadius="full"
                  px={3}
                >
                  {item.value}
                </Badge>
              </HStack>
              <Progress
                value={maxValue > 0 ? (item.value / maxValue) * 100 : 0}
                colorScheme={item.color || colorScheme}
                size="md"
                borderRadius="md"
                bg="gray.100"
              />
            </Box>
          ))}
        </VStack>
      </VStack>
    );
  }
