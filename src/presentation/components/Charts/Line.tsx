import { Text, theme } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

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

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function returnOptions(tasks: any) {
  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.colors.gray[500],
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      enabled: false,
    },

    xaxis: {
      type: "category",
      axisBorder: {
        color: theme.colors.gray[600],
      },
      axisTicks: {
        color: theme.colors.gray[600],
      },
      categories: tasks.map(label => {
        return `${label.labels.slice(0, 40)}...`;
      }),
    },
    fill: {
      opacity: 0.3,
      type: "gradient",
      gradient: {
        shade: "dark",
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  };

  return options;
}

function returnSeries(item: any) {
  let data = item.map(data => {
    return data.data;
  })

  return [{ name: "series", data: data }];
}


interface CharProps {
  title: string;
  type?:
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "treemap"
  | "boxPlot"
  | "candlestick"
  | "radar"
  | "polarArea"
  | "rangeBar";
  categories: any;
  height?: number;
  width?: number;
}

export default function LineChat({
  title,
  type,
  categories,
  height = 500,
  width = 900
}: CharProps): JSX.Element {
  return (
    <>
      <Text fontSize="md" mb="4">
        {title}
      </Text>

      <Chart
        options={returnOptions(categories)}
        type={type}
        series={returnSeries(categories)}
        height={height}
        width={width}
      />
    </>
  );
}
