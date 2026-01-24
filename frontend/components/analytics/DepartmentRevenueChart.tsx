"use client";

import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Keeping Bar registered just in case
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Department Specific Data Generators
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DepartmentRevenueLineChart = ({ department, invested, generated, isLoss }: { department: string, invested: number[], generated: number[], isLoss?: boolean }) => {

  const totalDuration = 500; // 0.5s total
  const delayBetweenPoints = totalDuration / 12; // 12 months

  const options = {
    responsive: true,
    animation: {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // Start hidden
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: (ctx: any) => {
          return ctx.index === 0
            ? ctx.chart.scales.y.getPixelForValue(0)
            : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
        },
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      }
    },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `${department} - Financial Performance (2025)` },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Revenue Invested (₹ Lakhs)',
        data: invested,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      },
      {
        label: 'Revenue Generated (₹ Lakhs)',
        data: generated,
        borderColor: isLoss ? 'rgb(255, 159, 64)' : 'rgb(53, 162, 235)', // Orange if loss (warning), Blue if profit
        backgroundColor: isLoss ? 'rgba(255, 159, 64, 0.5)' : 'rgba(53, 162, 235, 0.5)',
        tension: 0.3
      },
    ],
  };

  return <Line options={options} data={data} />;
};
