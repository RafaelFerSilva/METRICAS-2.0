import { useColorModeValue, VStack, Icon , Box, Text} from "@chakra-ui/react";
import { MdBarChart } from "react-icons/md";

export function EmptyChart({ 
    title = "Gráfico Vazio", 
    height = "300px" 
  }: { 
    title?: string; 
    height?: string; 
  }) {
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
  
    return (
      <Box
        h={height}
        bg={bgColor}
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={3}>
          <Icon as={MdBarChart} boxSize={8} color="gray.400" />
          <Text color="gray.500" fontSize="sm" fontWeight="medium">
            {title}
          </Text>
          <Text color="gray.400" fontSize="xs">
            Aguardando dados...
          </Text>
        </VStack>
      </Box>
    );
  }