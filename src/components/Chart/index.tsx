// components/Chart.tsx
import { Box } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  data: any;
  title: string;
}

const Chart: React.FC<ChartProps> = ({ data, title }) => {
  return (
    <Box
      p={["4", "5"]}
      bg="Snow"
      borderRadius={8}
      pb="4"
      mb="4"
      maxWidth="820px"
      minWidth="720px"
    >
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: title
            }
          }
        }}
      />
    </Box>
  );
};

export default Chart;
