import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RecruiterActivityChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      stacked: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#64748b']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ['#3b82f6', '#22c55e', '#f59e0b'],
    series: [
      {
        name: 'Active Jobs',
        data: data.map(item => item.activeJobs.length)
      },
      {
        name: 'Submissions',
        data: data.map(item => item.submissions)
      },
      {
        name: 'Interviews',
        data: data.map(item => item.interviews)
      }
    ],
    xaxis: {
      categories: data.map(item => item.name),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: '#64748b'
        }
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#64748b'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Recruiter Activity</h3>
      <ReactApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default RecruiterActivityChart;
