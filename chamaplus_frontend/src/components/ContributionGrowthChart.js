import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ContributionGrowthChart({ contributions }) {
  // Get unique years from contributions
  const getYearsFromContributions = () => {
    const years = new Set();
    contributions.forEach(contribution => {
      const date = new Date(contribution.date);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort();
  };

  // Get months in the selected date range
  const getMonthsInRange = () => {
    if (contributions.length === 0) return [];
    
    // Get min and max dates from contributions
    const dates = contributions.map(c => new Date(c.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    const months = [];
    const currentDate = new Date(minDate);
    currentDate.setDate(1); // Start from the first day of the month
    
    while (currentDate <= maxDate) {
      months.push({
        name: currentDate.toLocaleString('default', { month: 'long' }),
        year: currentDate.getFullYear(),
        month: currentDate.getMonth()
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return months;
  };
  
  // Get months to display
  const monthsInRange = getMonthsInRange();
  
  // Initialize monthly data
  const monthlyData = {};
  const monthlyColors = [];
  
  monthsInRange.forEach(({name, year}) => {
    const monthYear = `${name} ${year}`;
    monthlyData[monthYear] = 0;
    monthlyColors.push(`hsl(${Math.random() * 360}, 70%, 50%)`);
  });

  // Group contributions by month
  const chamaTotals = {};
  contributions.forEach(contribution => {
    const date = new Date(contribution.date);
    const month = date.toLocaleString('default', { month: 'long' });
    const monthYear = `${month} ${date.getFullYear()}`;
    const amount = parseFloat(contribution.amount.replace(/[^0-9.-]+/g, ''));
    
    // Add to monthly totals if this month is in our range
    if (monthYear in monthlyData) {
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + amount;
    }

    // Chama totals
    if (!chamaTotals[contribution.chama]) {
      chamaTotals[contribution.chama] = 0;
    }
    chamaTotals[contribution.chama] += amount;
  });

  // Prepare chart data with only the months in range
  const monthlyTotals = {
    labels: monthsInRange.map(({name, year}) => `${name} ${year}`),
    data: monthsInRange.map(({name, year}) => monthlyData[`${name} ${year}`] || 0),
    colors: monthlyColors
  };

  // Line chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Contribution Growth',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      datalabels: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `KSH ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'KSH ' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Calculate cumulative data
  const cumulativeData = [];
  monthlyTotals.data.reduce((sum, value) => {
    const total = sum + value;
    cumulativeData.push(total);
    return total;
  }, 0);

  // Area chart options
  const areaOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Cumulative Contributions',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      datalabels: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `KSH ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'KSH ' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Contribution Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `KSH ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
      datalabels: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'KSH ' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Line Chart - Growth Trend */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Contribution Growth Trend</h3>
        <div className="chart-container">
          <Line options={lineOptions} data={{
            labels: monthlyTotals.labels,
            datasets: [{
              label: 'Total Contributions',
              data: monthlyTotals.data,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: true,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }],
          }} />
        </div>
      </div>

      {/* Area Chart - Cumulative */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Cumulative Contributions</h3>
        <div className="chart-container">
          <Line options={areaOptions} data={{
            labels: monthlyTotals.labels,
            datasets: [{
              data: cumulativeData,
              fill: true,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4
            }]
          }} />
        </div>
      </div>

      {/* Bar Chart - Monthly Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Contribution Distribution</h3>
        <div className="chart-container">
          <Bar options={barOptions} data={{
            labels: monthlyTotals.labels,
            datasets: [{
              label: 'Contributions',
              data: monthlyTotals.data,
              backgroundColor: monthlyTotals.colors,
              borderWidth: 1,
            }],
          }} />
        </div>
      </div>
    </div>
  );
}

export default ContributionGrowthChart;
