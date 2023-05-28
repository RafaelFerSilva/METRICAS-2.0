import { Divider, Heading, Text } from '@chakra-ui/react';
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

function createChart(labels: string[] | undefined, values: any, label: string){

  let truncatedLabel = labels?.map(item => {
    if(item.length < 40){
      return item
    }
      return `${item.slice(0, 40)}...`
  })
  const data = {
    labels: truncatedLabel, 
    datasets: [
      {
        label: `${label}`,
        barPercentage: 0.5,
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 3,
      },
    ],
  };
  return data;
}

interface PropsChart {
  title: string, 
  labels: any[] | undefined, 
  data: any, 
  label: any
}

export function LineChart({title, labels, data, label}: PropsChart){
  return (
    <>
        <Heading as="h2" size="sm">{title}</Heading>
        <Divider orientation='horizontal' />
        <Line data={createChart(labels, data, label)} />
    </>
  );
}
