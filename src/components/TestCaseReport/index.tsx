import { Flex, Heading, Box, Stack, Accordion } from "@chakra-ui/react";
import { useState } from "react";
import FilterComponent from '../FilterComponent';
import { SummaryTestsCases } from "../SummaryTestsCases";
import TestCaseCharts from "../TestCaseCharts";
import { AccordionSection } from "../AccordionSection";
import { useTestCaseData } from "../../hooks/useTestCaseData";
import TableTestCase from "../TableTestCase";

export default function TestCaseReport({ testsCases }: any) {
  const [filters, setFilters] = useState<{ field: string; value: string }[]>([]);
  const { processedData, filteredData, countDistinctValues, preparePercentChartData, prepareRawChartData } = useTestCaseData(testsCases, filters);

// Função para ordenar os dados de "risk"
const sortRiskData = (data: { [key: string]: number }) => {
  const order = ["1 - High", "2 - Medium", "3 - Low", "Blank"];
  const sortedData = Object.keys(data)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as { [key: string]: number });

  // Verifica se existem dados em branco e adiciona à lista
  if (!data["Blank"]) {
    sortedData["Blank"] = 0; // ou o valor que você desejar para representar a contagem em branco
  }

  return sortedData;
};

// Ajuste no hook, aplicando a ordenação antes de gerar os dados
const chartData = {
  automationPercentStatusChartData: preparePercentChartData(countDistinctValues.automationStatus),
  automationStatusChartData: prepareRawChartData(countDistinctValues.automationStatus),
  riskPercentChartData: preparePercentChartData(sortRiskData(countDistinctValues.risk)), // Aplicando a ordenação aqui
  riskChartData: prepareRawChartData(sortRiskData(countDistinctValues.risk)),            // Aplicando a ordenação aqui
  platformPercentChartData: preparePercentChartData(countDistinctValues.platform),
  platformChartData: prepareRawChartData(countDistinctValues.platform),
  origemPercentChartData: preparePercentChartData(countDistinctValues.origem),
  origemChartData: prepareRawChartData(countDistinctValues.origem),
  isSmokePercentChartData: preparePercentChartData(countDistinctValues.isSmoke),
  isSmokeChartData: prepareRawChartData(countDistinctValues.isSmoke),
  statePercentCharData: preparePercentChartData(countDistinctValues.state),
  stateCharData: prepareRawChartData(countDistinctValues.state)
};

  const labels = [
    "id",
    "System.AreaPath",
    "System.Title",
    "Microsoft.VSTS.Common.Risk",
    "Custom.ec38de40-257b-4c45-9db9-284080382c3e",
    "Custom.SmokeTest",
    "Custom.Plataforma",
    "Custom.e0ac16d1-5c7a-42f5-8111-be8b335c9e8e",
    "System.State",
  ];

  return (
    <Box p="4" >
      <Flex align="center">
        <Heading size="md" fontWeight="normal">
          Test Case Report
        </Heading>
      </Flex>

      <FilterComponent
        filters={filters}
        setFilters={setFilters}
        processedData={processedData}
        labels={labels}
      />

      <SummaryTestsCases
        total={filteredData.length}
        automated={countDistinctValues.automationStatus}
      />

      <Stack>
        <Accordion allowToggle>
          <AccordionSection title="Graphics">
            <TestCaseCharts chartData={chartData} />
          </AccordionSection>

          <AccordionSection title="Tests cases list">
            <TableTestCase data={filteredData} headers={labels} />
          </AccordionSection>
        </Accordion>
      </Stack>
    </Box>
  );
}
