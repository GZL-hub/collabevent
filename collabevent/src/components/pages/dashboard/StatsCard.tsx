import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
    </div>
  );
};

export default StatsCard;