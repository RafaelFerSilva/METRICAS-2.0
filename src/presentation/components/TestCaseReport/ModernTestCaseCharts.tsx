import { SimpleGrid } from "@chakra-ui/react";
import Chart from "../Chart";

interface Props {
    chartData: {
        automationStatusChartData: any;
        riskChartData: any;
        stateCharData: any;
    };
}

export default function ModernTestCaseCharts({ chartData }: Props) {
    const {
        automationStatusChartData,
        riskChartData,
        stateCharData
    } = chartData;

    return (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="100%">
            <Chart
                data={automationStatusChartData}
                title="Status de Automação"
                type="bar-vertical"
                tip="Proporção de testes automatizados vs manuais."
            />
            <Chart
                data={riskChartData}
                title="Distribuição de Risco"
                type="bar-vertical"
                tip="Classificação de risco dos cenários (High/Medium/Low)."
            />
            <Chart
                data={stateCharData}
                title="Estado dos Testes"
                type="bar-vertical"
                tip="Ciclo de vida dos testes (Design, Ready, Closed)."
            />
        </SimpleGrid>
    );
}
