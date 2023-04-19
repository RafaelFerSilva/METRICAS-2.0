import { Box, Divider, Heading } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';

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

function createChart(labels1: string[] | undefined, values1: any, label1: string, labels2: string[] | undefined, values2: any, label2: string, labels3: string[] | undefined, values3: any, label3: string){

  let truncatedLabel = labels1?.map(item => {
    if(item.length < 40){
      return item
    }
      return `${item.slice(0, 40)}...`
  })
  const data = {
    labels: truncatedLabel, 
    datasets: [
      {
        label: `${label1}`,
        barPercentage: 0.5,
        data: values1,
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
      {
        label: `${label2}`,
        barPercentage: 0.5,
        data: values2,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
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
      {
        label: `${label3}`,
        barPercentage: 0.5,
        data: values3,
        backgroundColor: [
          'rgba(255, 99, 132, 1.2)',
          'rgba(54, 162, 235, 1.2)',
          'rgba(255, 206, 86, 1.2)',
          'rgba(75, 192, 192, 1.2)',
          'rgba(153, 102, 255, 1.2)',
          'rgba(255, 159, 64, 1.2)',
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
      }
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

export function ChartVerticalBarDataSets({title, labels1, data1, label1, labels2, data2, label2, labels3, data3, label3}){

  return (
    <Box>
      <Heading as="h2" size="sm">{title}</Heading>
      <Divider orientation='horizontal' />
      <Bar itemType="Line" data={createChart(labels1, data1, label1, labels2, data2, label2, labels3, data3, label3)} />
    </Box>
  );
}
