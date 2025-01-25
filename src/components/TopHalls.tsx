import React from 'react';
import { Trophy } from 'lucide-react';
import { CumulativeData } from '../types';

interface TopHallsProps {
  data: CumulativeData[];
  onHallSelect: (hall: string) => void;
}

const TopHalls: React.FC<TopHallsProps> = ({ data, onHallSelect }) => {
  const topHalls = data.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 mb-8">
      <h2 className="text-2xl font-serif text-[#041E42] mb-6">Overall Leaders</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {topHalls.map((hall, index) => (
          <div
            key={hall.name}
            onClick={() => onHallSelect(hall.name)}
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className={`h-5 w-5 ${
                index === 0
                  ? 'text-yellow-400'
                  : index === 1
                  ? 'text-gray-400'
                  : index === 2
                  ? 'text-amber-600'
                  : 'text-gray-300'
              }`} />
              <span className="font-medium">{index + 1}</span>
            </div>
            <div className="mt-2">
              <div className="font-semibold text-[#041E42] truncate">
                {hall.name}
              </div>
              <div className="text-lg font-bold text-[#041E42]">
                {hall.points} Points
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopHalls;