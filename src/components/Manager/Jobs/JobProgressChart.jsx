import React from 'react';
import ReactApexChart from 'react-apexcharts';

const JobProgressChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#3b82f6', '#22c55e', '#f59e0b'],
    series: [
      {
        name: 'Open Jobs',
        data: data.map(item => item.openJobs)
      },
      {
        name: 'In Progress',
        data: data.map(item => item.inProgressJobs)
      },
      {
        name: 'Closed',
        data: data.map(item => item.closedJobs)
      }
    ],
    xaxis: {
      categories: data.map(item => item.date),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Jobs',
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
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Job Progress</h3>
      <ReactApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default JobProgressChart;
