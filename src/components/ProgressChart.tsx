import React from 'react';
import { ChartData } from '../types';

interface ProgressChartProps {
  data: ChartData[];
  hallName: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, hallName }) => {
  const maxPoints = Math.max(...data.map(d => d.points));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{hallName} - Points Progress</h3>
      <div className="h-40 flex items-end space-x-2">
        {data.map((point, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center"
          >
            <div className="text-xs text-gray-600 mb-1">{point.points}</div>
            <div
              className="w-full bg-[#041E42] rounded-t"
              style={{
                height: `${(point.points / maxPoints) * 100}%`,
                minHeight: '4px'
              }}
            />
            <div className="text-xs text-gray-600 mt-1">W{point.weekNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;