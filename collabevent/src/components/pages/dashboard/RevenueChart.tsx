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
  };

  const revenueChartSeries = [
    {
      name: 'Revenue',
      data: [30, 40, 35, 50, 49, 60],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Revenue Breakdown</h2>
        <TrendingUp className="text-green-500" size={20} />
      </div>
      
      {/* Chart container with flex-grow to fill available space */}
      <div className="flex-grow flex flex-col justify-center">
        <Chart
          options={revenueChartOptions}
          series={revenueChartSeries}
          type="area"
          height={300}
        />
      </div>
      
      {/* Bottom stats section */}
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Revenue: $264k</span>
          <span className="text-green-600">+12.5% from last month</span>
        </div>
        
        {/* Additional revenue insights to match the height */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg. Monthly</p>
            <p className="text-lg font-semibold text-indigo-600">$44k</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Peak Month</p>
            <p className="text-lg font-semibold text-green-600">$60k</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p>Q1: $105k</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p>Q2: $159k</p>
          </div>
          <div className="text-center p-2 bg-indigo-50 rounded text-indigo-600">
            <p>Growth: +51%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;