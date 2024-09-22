import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";

export function SummaryTestsCases({
  total,
  automated,
  automationStatusChartData,
}: any) {
  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, md: 3, lg: 5 }} // Ajuste de colunas para diferentes tamanhos de tela
      spacing="20px"
      mb="3"
    >
      {[
        { title: "Total", value: total || 0 },
        { title: "Automated", value: automated["Automatizado"] || 0 },
        { title: "Planned", value: automated["Planejado para automação"] || 0 },
        { title: "% Automated", value: (((automated["Automatizado"] || 0) / (total || 1)) * 100).toFixed(2) + " %" },
        { title: "% Planned", value: (((automated["Planejado para automação"] || 0) / (total || 1)) * 100).toFixed(2) + " %" },
      ].map(({ title, value }) => (
        <Box
          key={title}
          borderRadius="md"
          bg="white"
          boxShadow="md"
          p="4"
          transition="transform 0.2s, box-shadow 0.2s"
          _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
        >
          <Heading
            bg="blue.200"
            borderTopRadius="md"
            p="2"
            textAlign="center"
            fontSize="lg"
          >
            {title}
          </Heading>
          <Text
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            bg="blue.50" // Cor de fundo para o valor
            p="2" // Espaçamento interno
            borderRadius="md" // Bordas arredondadas
          >
            {value}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
