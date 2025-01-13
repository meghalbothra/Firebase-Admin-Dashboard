import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function UserDistributionChart() {
  const data = {
    labels: ['Admin', 'Editor', 'Viewer'],
    datasets: [
      {
        data: [3, 7, 20],
        backgroundColor: [
          'rgb(99, 102, 241)',
          'rgb(147, 51, 234)',
          'rgb(59, 130, 246)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}