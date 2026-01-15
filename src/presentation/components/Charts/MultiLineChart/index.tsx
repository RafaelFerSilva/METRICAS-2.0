import { Box, Divider, Heading } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

interface MultiLineChartProps {
  title: string;
  labels: string[];
  datasets: Dataset[];
  maxWidth?: string;
  minWidth?: string;
  bg?: string;
  borderRadius?: any;
}

const defaultColors = [
  "rgba(255, 99, 132, 1)",    // vermelho
  "rgba(54, 162, 235, 1)",    // azul
  "rgba(255, 206, 86, 1)",    // amarelo
  "rgba(75, 192, 192, 1)",    // verde água
  "rgba(153, 102, 255, 1)",   // roxo
  "rgba(255, 159, 64, 1)",    // laranja
];

export function MultiLineChart({
  title,
  labels,
  datasets,
  maxWidth = "100%",
  minWidth = "100%",
  bg = "white",
  borderRadius = 8,
}: MultiLineChartProps) {
  // Trunca labels longas para até 40 caracteres
  const truncatedLabels = labels.map((label) =>
    label.length > 40 ? label.slice(0, 40) + "..." : label
  );

  // Prepara datasets com cores padrão se não fornecidas
  const preparedDatasets = datasets.map((ds, i) => ({
    borderColor: defaultColors[i % defaultColors.length],
    backgroundColor: ds.backgroundColor ?? defaultColors[i % defaultColors.length].replace("1)", "0.2)"),
    borderWidth: ds.borderWidth ?? 3,
    fill: ds.fill ?? false,
    tension: ds.tension ?? 0.3,
    ...ds,
  }));

  const data = {
    labels: truncatedLabels,
    datasets: preparedDatasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest" as const,
      intersect: false,
    },
    layout: {
      padding: {
        top: 30,
        bottom: 40,  // aumentei para dar mais espaço embaixo
        left: 20,
        right: 20,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Labels",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          autoSkip: true,
          maxTicksLimit: 20,
          padding: 10,
        },
        offset: true, // adiciona espaço nas bordas do eixo X
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Valores",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box
      bg={bg}
      maxWidth={maxWidth}
      minWidth={minWidth}
      borderRadius={borderRadius}
      p={4}
      boxShadow="md"
      borderWidth={1}
      borderColor="gray.200"
      height="450px"
    >
      <Heading as="h2" size="md" mb={4}>
        {title}
      </Heading>
      <Divider mb={4} />
      <Line data={data} options={options} />
    </Box>
  );
}