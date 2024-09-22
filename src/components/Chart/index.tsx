import { Box, Text } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface ChartProps {
  data: any;
  title: string;
  maxWidth?: string;
  minWidth?: string;
  bg?: string;
  borderRadius?: any;
}

const Chart: React.FC<ChartProps> = ({ data, title, maxWidth = "100%", minWidth = "100%", bg = "white", borderRadius = 8 }) => {
  if (!data || !data.labels || !data.datasets) {
    return (
      <Box bg={bg} maxWidth={maxWidth} minWidth={minWidth} borderRadius={borderRadius} p={4} boxShadow="md" borderWidth={1} borderColor="gray.200">
        <Text align="center" fontWeight="bold" color="gray.500">Dados indisponíveis para o gráfico: {title}</Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      width="100%"
      height="450px" // Aumenta a altura do gráfico
      maxWidth={maxWidth}
      minWidth={minWidth}
      borderRadius={borderRadius}
      boxShadow="lg"
      borderWidth={1}
      borderColor="gray.200"
      overflow="hidden"
    >
      <Text
        textAlign="center"
        fontSize="lg"
        fontWeight="bold"
        p={2}
        bg="gray.100"
        borderTopRadius={borderRadius}
      >
        {title}
      </Text>
      <Bar
        data={data}
        options={{
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
              offset: 4, // Adiciona um pequeno espaço entre o datalabel e o topo da coluna
            },
          },
          layout: {
            padding: {
              top: 30, // Aumenta o espaço superior
              bottom: 20,
              left: 20,
              right: 20,
            },
          },
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default Chart;
