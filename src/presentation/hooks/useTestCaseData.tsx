import { useMemo } from "react";

export function useTestCaseData(testsCases: any[], filters: any[]) {
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

      // Contagem de cada item e valores em branco
      if (state) result.state[state] = (result.state[state] || 0) + 1;
      if (automationStatus)
        result.automationStatus[automationStatus] =
          (result.automationStatus[automationStatus] || 0) + 1;
      if (priority) result.priority[priority] = (result.priority[priority] || 0) + 1;
      if (platform) result.platform[platform] = (result.platform[platform] || 0) + 1;
      if (origem) result.origem[origem] = (result.origem[origem] || 0) + 1;

      // Contagem de risk
      if (risk) {
        result.risk[risk] = (result.risk[risk] || 0) + 1;
      } else {
        result.risk["Blank"] = (result.risk["Blank"] || 0) + 1; // Contagem de riscos em branco
      }

      // Contagem de smoke
      if (isSmoke) {
        result.isSmoke[isSmoke] = (result.isSmoke[isSmoke] || 0) + 1;
      } else {
        result.isSmoke["Blank"] = (result.isSmoke["Blank"] || 0) + 1; // Contagem de smoke em branco
      }
    });

    // Ordenação e manutenção de valores em branco para todos os campos
    const orderedLevels = {
      risk: ["1 - High", "2 - Medium", "3 - Low", "Blank"],
      smoke: ["Yes", "No", "Blank"],
      state: Object.keys(result.state).concat("Blank"),
      automationStatus: Object.keys(result.automationStatus).concat("Blank"),
      priority: Object.keys(result.priority).concat("Blank"),
      platform: Object.keys(result.platform).concat("Blank"),
      origem: Object.keys(result.origem).concat("Blank"),
    };

    Object.keys(orderedLevels).forEach((key) => {
      const ordered = orderedLevels[key];
      result[key] = ordered.reduce((acc, level) => {
        acc[level] = (result[key] && result[key][level]) || 0; // Proteção contra undefined
        return acc;
      }, {} as { [key: string]: number });
    });

    return result;
  }, [filteredData]);

  // Cores e propriedades de estilo compartilhadas
  const chartProperties = {
    barPercentage: 0.5,
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
  };

  // Função que retorna os dados sem conversão para porcentagem
  const prepareRawChartData = (data: { [key: string]: number }) => {
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Contagem",
          data: Object.values(data),
          ...chartProperties, // Reutilizando propriedades
        },
      ],
    };
  };

  // Função que retorna os dados em porcentagem
  const preparePercentChartData = (data: { [key: string]: number }) => {
    const total = Object.values(data).reduce((acc, value) => acc + value, 0);

    const percentageData = Object.keys(data).reduce((acc, key) => {
      acc[key] = ((data[key] / total) * 100).toFixed(2);
      return acc;
    }, {} as { [key: string]: string });

    return {
      labels: Object.keys(percentageData),
      datasets: [
        {
          label: "Porcentagem (%)",
          data: Object.values(percentageData),
          ...chartProperties, // Reutilizando propriedades
        },
      ],
    };
  };

  return { processedData, filteredData, countDistinctValues, preparePercentChartData, prepareRawChartData };
}
