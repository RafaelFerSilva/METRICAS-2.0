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
    statePercentCharData: any;
    stateCharData: any
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
    statePercentCharData,
    stateCharData
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
        <Chart data={automationPercentStatusChartData} title="Automation Status %" type="bar-vertical" />
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
        <Chart data={automationStatusChartData} title="Automation Status" type="bar-vertical" />
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
        <Chart data={riskPercentChartData} title="Risk %"  type="bar-vertical"/>
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
        <Chart data={riskChartData} title="Risk" type="bar-vertical" />
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
        <Chart data={platformPercentChartData} title="Platform %" type="bar-vertical" />
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
        <Chart data={platformChartData} title="Platform" type="bar-vertical" />
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
        <Chart data={origemPercentChartData} title="Origem %" type="bar-vertical" />
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
        <Chart data={origemChartData} title="Origem" type="bar-vertical" />
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
        <Chart data={isSmokePercentChartData} title="Smoke Test %" type="bar-vertical" />
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
        <Chart data={isSmokeChartData} title="Smoke Test" type="bar-vertical" />
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
        <Chart data={statePercentCharData} title="State %" type="bar-vertical" />
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
        <Chart data={stateCharData} title="State" type="bar-vertical" />
      </Box>
    </SimpleGrid>
  );
}
