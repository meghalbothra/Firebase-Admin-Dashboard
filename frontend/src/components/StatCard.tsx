import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trendIcon?: React.ReactNode; // Optional prop
  className?: string;         // Optional prop
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}


export function StatCard({ title, value, icon, trend, onClick }: StatCardProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow p-6 transition-all hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="text-gray-400">{icon}</div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </button>
  );
}