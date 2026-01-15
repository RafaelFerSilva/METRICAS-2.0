import { Box } from "@chakra-ui/react";

export function ChartSkeleton({ height = "300px" }: { height?: string }) {
    return (
      <Box h={height} bg="gray.100" borderRadius="lg" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="0"
          left="-100%"
          w="100%"
          h="100%"
          bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
          animation="shimmer 1.5s infinite"
        />
      </Box>
    );
  }
  