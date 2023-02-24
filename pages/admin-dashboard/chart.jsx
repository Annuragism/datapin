import React from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function DataChart(props) {
  const { chartData } = props;


const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      display:false
    },
    title: {
      display: true,
      text: "Documents Analysis",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const labels = chartData&&Object.keys(chartData);
const chartValue = chartData&&Object.values(chartData);

const data = {
  labels,
  datasets: [
    {
      label: "Documents",
      data: chartValue,//[(10, 20, 30, 40, 50, 60, 70)],
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 200, 0);
        gradient.addColorStop(0, "rgb(140, 68, 232)");
        gradient.addColorStop(1, "rgb(184, 82, 220)");
        return gradient;
      },
    },
  ],
};

  return <Bar options={options} data={data} />;
}
