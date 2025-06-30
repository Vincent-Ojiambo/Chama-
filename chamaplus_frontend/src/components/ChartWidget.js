import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import PropTypes from 'prop-types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartWidget = ({ 
  title, 
  data, 
  xKey = 'x', 
  yKey = 'y', 
  color = '#4f46e5',
  type = 'bar' 
}) => {
  // Format data for ChartJS
  const chartData = {
    labels: data.map(item => item[xKey]),
    datasets: [{
      label: title,
      data: data.map(item => item[yKey]),
      backgroundColor: type === 'bar' ? 
        `${color}80` : 'transparent',
      borderColor: color,
      borderWidth: type === 'line' ? 2 : 0,
      tension: type === 'line' ? 0.4 : 0.1,
      fill: type === 'line',
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#fff',
      pointHitRadius: 10,
      pointBorderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        yAlign: 'bottom',
        callbacks: {
          label: (context) => {
            return `KES ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          callback: (value) => `KES ${value.toLocaleString()}`,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow h-full flex flex-col">
      <h2 className="font-semibold text-lg text-gray-800 mb-4">{title}</h2>
      <div className="flex-1 min-h-[300px]">
        {type === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

ChartWidget.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xKey: PropTypes.string,
  yKey: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.oneOf(['bar', 'line']),
};

export default ChartWidget;
