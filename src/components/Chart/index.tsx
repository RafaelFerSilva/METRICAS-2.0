import { Box, Text } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
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
  Tooltip,
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
  multiColor?: boolean; // nova prop para cores múltiplas
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
  multiColor = false, // padrão false
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

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
      },
      legend: {
        position: "bottom",
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#000',
        formatter: (value: number) => value,
        font: {
          weight: 'bold',
        },
        offset: 4,
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
      height="450px"
      maxWidth={maxWidth}
      minWidth={minWidth}
      borderRadius={borderRadius}
      boxShadow="lg"
      borderWidth={1}
      borderColor="blue.200"
      overflow="hidden"
    >
      <Text
        textAlign="center"
        fontSize="lg"
        fontWeight="bold"
        p={2}
        bg="blue.200"
        borderTopRadius={borderRadius}
      >
        {title}
      </Text>

      {type === "bar-vertical" && (
        <Bar data={dataWithColors} options={options} style={{ width: "100%", height: "100%" }} />
      )}

      {type === "bar-horizontal" && (
        <Bar data={dataWithColors} options={options} style={{ width: "100%", height: "100%" }} />
      )}

      {type === "line" && (
        <Line data={dataWithColors} options={options} style={{ width: "100%", height: "100%" }} />
      )}
    </Box>
  );
};

export default Chart;
