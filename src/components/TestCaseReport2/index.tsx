// pages/TestCaseReport2.tsx
import { Flex, Heading, Box, Stack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Chart from "../Chart";
import TableTestCase from "../TableTestCase";
import FilterComponent from '../FilterComponent'

export default function TestCaseReport2({ testsCases }: any) {
  const [filters, setFilters] = useState<{ field: string; value: string }[]>([]);

  const processedData = useMemo(() => {
    return testsCases
      .filter((item: any) => item.fields)
      .map((item: any) => ({
        id: item.id || "",
        ...item.fields,
      }));
  }, [testsCases]);

  const filteredData = useMemo(() => {
    return filters.reduce((acc, filter) => {
      return acc.filter((item) => item[filter.field] === filter.value);
    }, processedData);
  }, [filters, processedData]);

  const countDistinctValues = useMemo(() => {
    const result = {
      state: {} as { [key: string]: number },
      automationStatus: {} as { [key: string]: number },
      priority: {} as { [key: string]: number },
      risk: {} as { [key: string]: number },
      platform: {} as { [key: string]: number },
      origem: {} as { [key: string]: number },
      isSmoke: {} as { [key: string]: number },
    };

    filteredData.forEach((item) => {
      const state = item["System.State"];
      const priority = item["Microsoft.VSTS.Common.Priority"];
      const risk = item["Microsoft.VSTS.Common.Risk"];
      const automationStatus = item["Custom.ec38de40-257b-4c45-9db9-284080382c3e"];
      const platform = item["Custom.Plataforma"];
      const origem = item["Custom.e0ac16d1-5c7a-42f5-8111-be8b335c9e8e"];
      const isSmoke = item["Custom.SmokeTest"];

      if (state) result.state[state] = (result.state[state] || 0) + 1;
      if (automationStatus)
        result.automationStatus[automationStatus] =
          (result.automationStatus[automationStatus] || 0) + 1;
      if (priority) result.priority[priority] = (result.priority[priority] || 0) + 1;
      if (risk) result.risk[risk] = (result.risk[risk] || 0) + 1;
      if (platform) result.platform[platform] = (result.platform[platform] || 0) + 1;
      if (origem) result.origem[origem] = (result.origem[origem] || 0) + 1;
      if (isSmoke) result.isSmoke[isSmoke] = (result.isSmoke[isSmoke] || 0) + 1;
    });

    return result;
  }, [filteredData]);

  // Função para calcular porcentagens
  const prepareChartData = (data: { [key: string]: number }) => {
    const total = Object.values(data).reduce((acc, value) => acc + value, 0);

    // Calcula porcentagens
    const percentageData = Object.keys(data).reduce((acc, key) => {
      acc[key] = ((data[key] / total) * 100).toFixed(2); // Arredonda para 2 casas decimais
      return acc;
    }, {} as { [key: string]: string });

    return {
      labels: Object.keys(percentageData),
      datasets: [
        {
          label: "Porcentagem (%)",
          barPercentage: 0.5,
          data: Object.values(percentageData),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 3,
        },
      ],
    };
  };

  const stateChartData = prepareChartData(countDistinctValues.state);
  const automationStatusChartData = prepareChartData(countDistinctValues.automationStatus);
  const riskChartData = prepareChartData(countDistinctValues.risk);
  const platformChartData = prepareChartData(countDistinctValues.platform);
  const origemChartData = prepareChartData(countDistinctValues.origem);
  const isSmokeChartData = prepareChartData(countDistinctValues.isSmoke);

  const labels = [
    "id",
    "System.AreaPath",
    "System.Title",
    "Microsoft.VSTS.Common.Risk",
    "Custom.ec38de40-257b-4c45-9db9-284080382c3e",
    "Custom.SmokeTest",
    "Custom.Plataforma",
    "Custom.e0ac16d1-5c7a-42f5-8111-be8b335c9e8e",
  ];

  return (
    <Box borderRadius={8} bg="GhostWhite" p="4" gap="4">
      <Flex mb="4" align="center">
        <Heading size="md" fontWeight="normal">
          Test Case Report
        </Heading>
      </Flex>

      {/* Novo componente de filtro */}
      <FilterComponent 
        filters={filters} 
        setFilters={setFilters} 
        processedData={processedData} 
        labels={labels} 
      />

      <Stack spacing="4">
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={stateChartData} title="State" />
        </Box>
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={automationStatusChartData} title="Automation Status" />
        </Box>
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={riskChartData} title="Risk" />
        </Box>
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={platformChartData} title="Platform" />
        </Box>
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={origemChartData} title="Origem" />
        </Box>
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={isSmokeChartData} title="Smoke Test" />
        </Box>
        {/* Tabela com dados filtrados */}
        <TableTestCase data={filteredData} headers={labels} />
      </Stack>
    </Box>
  );
}
