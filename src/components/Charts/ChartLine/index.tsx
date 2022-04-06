import { Text } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  } from 'chart.js';
  
  ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  );

function createOptions(title: string){
const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return options;
}

export interface ChartData {
  labels: string;
  data: number | undefined;
}

function createChart2(cicle: ChartData[], label: string){
  const data = {
    labels: cicle.map(label => {
      return `${label.labels.slice(0, 40)}...`;
    }),
    datasets: [
      {
        label: label,
        data: cicle.map(data => {
          return data.data;
        }),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return data;
}

interface LineChartProps {
  data: any;
  title: string;
  label: string;
}

export function LineChart({data, title, label}: LineChartProps){
  return (
    <>
        <Text >{title}</Text>
        <hr />
        <Line options={createOptions(title)} data={createChart2(data, label)} />
    </>
  );
}
