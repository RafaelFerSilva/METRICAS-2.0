import { Flex, Heading, Box, Stack, Accordion, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import FilterComponent from '../FilterComponent';
import { AccordionSection } from "../AccordionSection";
import { useTestCaseData } from "../../hooks/useTestCaseData";
import TableTestCase from "../TableTestCase";
import { TestKpiCards } from "./TestKpiCards";
import ModernTestCaseCharts from "./ModernTestCaseCharts";
import Pagination from "../Pagination";
import { AzureFields, KPI_VALUES } from "../../../core/config/azure-fields";

const sortRiskData = (data: { [key: string]: number }) => {
  const order = ["1 - High", "2 - Medium", "3 - Low", "Blank"];
  const sortedData = Object.keys(data)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as { [key: string]: number });

  if (!data["Blank"]) {
    sortedData["Blank"] = 0;
  }

  return sortedData;
};

export default function TestCaseReport({ testsCases, onRefresh }: { testsCases: any, onRefresh?: () => void }) {
  const [filters, setFilters] = useState<{ field: string; value: string }[]>([]);
  const { processedData, filteredData, countDistinctValues, preparePercentChartData, prepareRawChartData } = useTestCaseData(testsCases, filters);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to sum counts based on allowed values
  const sumCounts = (counts: { [key: string]: number }, allowedValues: string[]) => {
    if (!counts) return 0;
    return Object.keys(counts).reduce((acc, key) => {
      // Check if key exactly matches or is contained (case insensitive)
      const isMatch = allowedValues.some(val =>
        key.toLowerCase().includes(val.toLowerCase())
      );

      const keyLower = key.toLowerCase();
      const isNegative = keyLower.includes("not ") || keyLower.includes("não ") || keyLower === "not automated";

      if (isMatch && !isNegative) return acc + counts[key];
      return acc;
    }, 0);
  };

  // KPI Calculations
  const total = filteredData.length;

  const automatedCount = sumCounts(countDistinctValues.automationStatus, KPI_VALUES.Automated);
  const highRiskCount = sumCounts(countDistinctValues.risk, KPI_VALUES.HighRisk);

  const chartData = {
    automationPercentStatusChartData: preparePercentChartData(countDistinctValues.automationStatus),
    automationStatusChartData: prepareRawChartData(countDistinctValues.automationStatus),
    riskPercentChartData: preparePercentChartData(sortRiskData(countDistinctValues.risk)),
    riskChartData: prepareRawChartData(sortRiskData(countDistinctValues.risk)),
    statePercentCharData: preparePercentChartData(countDistinctValues.state),
    stateCharData: prepareRawChartData(countDistinctValues.state)
  };

  const labels = [
    AzureFields.Id,
    AzureFields.AreaPath,
    AzureFields.Title,
    AzureFields.Risk,
    AzureFields.AutomationStatus,
    AzureFields.State,
  ];

  return (
    <Box p="4" w="100%">
      <Stack spacing={8}>
        <Flex align="center" justify="space-between">
          <Heading size="lg" color="blue.600">
            Test Case Report
          </Heading>
          <Text color="gray.500" fontSize="sm">{total} casos listados</Text>
        </Flex>

        <TestKpiCards
          total={total}
          automated={automatedCount}
          highRiskCount={highRiskCount}
        />

        <FilterComponent
          filters={filters}
          setFilters={setFilters}
          processedData={processedData}
          labels={labels}
        />

        <Accordion allowToggle defaultIndex={[0]}>
          <AccordionSection title="Strategic Analysis">
            <Box py={4}>
              <ModernTestCaseCharts chartData={chartData} />
            </Box>
          </AccordionSection>

          <AccordionSection title="Detail List">
            <TableTestCase data={paginatedData} headers={labels} onRefresh={onRefresh} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={totalItems}
            />
          </AccordionSection>
        </Accordion>
      </Stack>
    </Box>
  );
}
