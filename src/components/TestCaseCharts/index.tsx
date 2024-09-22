import { Box, SimpleGrid } from "@chakra-ui/react";
import Chart from "../Chart";

interface Props {
  chartData: {
    automationPercentStatusChartData: any;
    automationStatusChartData: any;
    riskPercentChartData: any;
    riskChartData: any;
    platformPercentChartData: any;
    platformChartData: any;
    origemPercentChartData: any;
    origemChartData: any;
    isSmokePercentChartData: any;
    isSmokeChartData: any;
  };
}

export default function TestCaseCharts({ chartData }: Props) {
  const {
    automationPercentStatusChartData,
    automationStatusChartData,
    riskPercentChartData,
    riskChartData,
    platformPercentChartData,
    platformChartData,
    origemPercentChartData,
    origemChartData,
    isSmokePercentChartData,
    isSmokeChartData,
  } = chartData;

  return (
    <SimpleGrid columns={[1, 1, 2, 2]} spacing={6} minWidth="100%">
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={automationPercentStatusChartData} title="Automation Status %" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={automationStatusChartData} title="Automation Status" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={riskPercentChartData} title="Risk %" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={riskChartData} title="Risk" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={platformPercentChartData} title="Platform %" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={platformChartData} title="Platform" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={origemPercentChartData} title="Origem %" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={origemChartData} title="Origem" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={isSmokePercentChartData} title="Smoke Test %" />
      </Box>
      <Box
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        width="100%"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      >
        <Chart data={isSmokeChartData} title="Smoke Test" />
      </Box>
    </SimpleGrid>
  );
}
