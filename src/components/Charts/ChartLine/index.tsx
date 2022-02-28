import { Text } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';

export interface ChartData {
  labels: string;
  data: number | undefined;
}

function createChart(cicle: ChartData[], label: string){
    const data = {
      labels: cicle.map(label => {
        return `${label.labels.slice(0, 40)}...`;
      }),
      datasets: [
        {
          label: label,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,

          data: cicle.map(data => {
            return data.data;
          }),
        },
      ],
    };
    return data;
}

export function LineChart(props: {data: any, title: string, label: string}){
  return (
    <>
        <Text >{props.title}</Text>
        <hr />
        <Line itemType="Line" data={createChart(props.data, props.label)} width={639} height={319} />
    </>
  );
}
