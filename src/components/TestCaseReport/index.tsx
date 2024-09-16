// pages/TestCaseReport.tsx
import { Flex, Heading, Box, Stack } from "@chakra-ui/react";
import { useMemo } from "react";
import Chart from "../Chart";
import TableComponent from "../TableComponent";

export default function TestCaseReport({ testsCases }: any) {
  const labels = useMemo(() => ["ID", "Name", "State", "Automation Status", "Priority"], []);

  const processedData = useMemo(() => {
    return testsCases
      .filter((item: any) => item.workItem)
      .map((item: any) => {
        const fields = item.workItem.workItemFields.reduce((acc: any, field: any) => ({ ...acc, ...field }), {});

        return {
          id: item.workItem.id || "",
          name: item.workItem.name || "",
          state: fields["System.State"] || "",
          automationStatus: fields["Microsoft.VSTS.TCM.AutomationStatus"] || "",
          priority: fields["Microsoft.VSTS.Common.Priority"] || ""
        };
      });
  }, [testsCases]);

  const countDistinctValues = useMemo(() => {
    const result = {
      state: {} as { [key: string]: number },
      automationStatus: {} as { [key: string]: number },
      priority: {} as { [key: number]: number }
    };

    processedData.forEach(({ state, automationStatus, priority }) => {
      if (state) result.state[state] = (result.state[state] || 0) + 1;
      if (automationStatus) result.automationStatus[automationStatus] = (result.automationStatus[automationStatus] || 0) + 1;
      if (priority) result.priority[priority] = (result.priority[priority] || 0) + 1;
    });

    return result;
  }, [processedData]);

  const prepareChartData = (data: { [key: string]: number }) => {
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Quantidade',
          barPercentage: 0.5,
          data: Object.values(data),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        }
      ]
    };
  };

  const stateChartData = prepareChartData(countDistinctValues.state);
  const automationStatusChartData = prepareChartData(countDistinctValues.automationStatus);
  const priorityChartData = prepareChartData(countDistinctValues.priority);

  return (
    <Box borderRadius={8} bg="GhostWhite" p="4" gap="4">
      <Flex mb="4" align="center">
        <Heading size="md" fontWeight="normal">
          Test Case Report
        </Heading>
      </Flex>

      {/* Stack para empilhar os gráficos verticalmente */}
      <Stack spacing="4">
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={stateChartData} title="State Distribution" />
        </Box>
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={automationStatusChartData} title="Automation Status Distribution" />
        </Box>
        <Box p="4" bg="Snow" borderRadius={8} pb="4">
          <Chart data={priorityChartData} title="Priority Distribution" />
        </Box>
      </Stack>

      {/* Tabela de Test Cases */}
      <TableComponent data={processedData} headers={labels} />
    </Box>
  );
}
