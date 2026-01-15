import { Box, Text, Flex, Tooltip as ChakraTooltip, Icon } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  ChartDataLabels
);

interface ChartProps {
  data: any;
  title: string;
  type: "bar-vertical" | "bar-horizontal" | "line";
  maxWidth?: string;
  minWidth?: string;
  bg?: string;
  borderRadius?: any;
  multiColor?: boolean;
  stacked?: boolean;
  tip?: string;
}

// Função para gerar cor random em formato rgba
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 200) + 30; // evitar cores muito claras
  const g = Math.floor(Math.random() * 200) + 30;
  const b = Math.floor(Math.random() * 200) + 30;
  return `rgba(${r},${g},${b},0.7)`;
};

const Chart: React.FC<ChartProps> = ({
  data,
  title,
  type,
  maxWidth = "100%",
  minWidth = "100%",
  bg = "white",
  borderRadius = 8,
  multiColor = false,
  stacked = false,
  tip,
}) => {
  if (!data || !data.labels || !data.datasets) {
    return (
      <Box
        bg={bg}
        maxWidth={maxWidth}
        minWidth={minWidth}
        borderRadius={borderRadius}
        p={4}
        boxShadow="md"
        borderWidth={1}
        borderColor="blue.200"
      >
        <Text align="center" fontWeight="bold" color="blue.500">
          Dados indisponíveis para o gráfico: {title}
        </Text>
      </Box>
    );
  }

  // Se multiColor for true, cria arrays de cores para cada dataset
  const coloredDatasets = data.datasets.map((dataset: any) => {
    if (!multiColor) return dataset;

    const dataLength = dataset.data.length;

    if (type === "line") {
      // Para linha, borderColor pode ser array para cores por ponto
      return {
        ...dataset,
        borderColor: Array(dataLength).fill(null).map(() => getRandomColor()),
        backgroundColor: "transparent", // linha normalmente transparente no fundo
        pointBackgroundColor: Array(dataLength).fill(null).map(() => getRandomColor()),
        fill: false,
        borderWidth: 2,
      };
    } else {
      // Para barras, backgroundColor pode ser array para cores por barra
      return {
        ...dataset,
        backgroundColor: Array(dataLength).fill(null).map(() => getRandomColor()),
      };
    }
  });

  const dataWithColors = {
    ...data,
    datasets: coloredDatasets,
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: stacked ? {
      x: { stacked: true },
      y: { stacked: true }
    } : undefined,
    plugins: {
      title: {
        display: false, // Hide default title since we render custom header
      },
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 4,
        displayColors: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#4A5568', // Gray-700
        formatter: (value: number) => Math.round(value), // Round to integer
        font: {
          weight: 'bold',
          size: 11
        },
        offset: -4,
      },
    },
    layout: {
      padding: {
        top: 30,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
  };

  return (
    <Box
      bg={bg}
      width="100%"
      height="100%"
      minHeight="500px" // Aumentado altura padrão
      maxWidth={maxWidth}
      minWidth={minWidth}
      borderRadius={borderRadius}
      boxShadow="lg"
      borderWidth={1}
      borderColor="gray.200" // Cor mais suave
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box p={3} bg="gray.100" borderBottomWidth={1} borderColor="gray.200">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="md" fontWeight="bold" color="gray.700">
            {title}
          </Text>
          {tip && (
            <ChakraTooltip label={tip} placement="top" hasArrow p={3} rounded="md" bg="gray.700">
              <Icon as={InfoOutlineIcon} color="blue.500" cursor="help" />
            </ChakraTooltip>
          )}
        </Flex>
      </Box>

      <Box flex="1" p={4}>
        {type === "bar-vertical" && (
          <Bar data={dataWithColors} options={options} />
        )}

        {type === "bar-horizontal" && (
          <Bar data={dataWithColors} options={options} />
        )}

        {type === "line" && (
          <Line data={dataWithColors} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default Chart;
