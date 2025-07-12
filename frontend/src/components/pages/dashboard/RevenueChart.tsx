import React from 'react';
import Chart from 'react-apexcharts';
import { TrendingUp } from 'lucide-react';

const RevenueChart: React.FC = () => {
  const revenueChartOptions = {
    chart: {
      type: 'area' as const,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
      height: '100%',
      parentHeightOffset: 0,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    colors: ['#4F46E5'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${value}k`,
      },
    },
    grid: {
      borderColor: '#f1f5f9',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 200
        }
      }
    }]
  };

  const revenueChartSeries = [
    {
      name: 'Revenue',
      data: [30, 40, 35, 50, 49, 60],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Revenue Breakdown</h2>
        <TrendingUp className="text-green-500" size={20} />
      </div>
      
      {/* Chart container with flex-grow to fill available space */}
      <div className="flex-grow min-h-0 flex flex-col justify-center">
        <Chart
          options={revenueChartOptions}
          series={revenueChartSeries}
          type="area"
          width="100%"
          height="100%"
        />
      </div>
      
      {/* Simplified stats section */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-lg font-semibold text-gray-800">$264k</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg. Monthly</p>
            <p className="text-lg font-semibold text-indigo-600">$44k</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Peak Month</p>
            <p className="text-lg font-semibold text-green-600">$60k</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;