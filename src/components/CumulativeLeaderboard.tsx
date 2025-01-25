import React from 'react';
import { CumulativeData } from '../types';

interface CumulativeLeaderboardProps {
  data: CumulativeData[];
  onHallSelect: (hall: string) => void;
  compact?: boolean;
}

const CumulativeLeaderboard: React.FC<CumulativeLeaderboardProps> = ({ 
  data, 
  onHallSelect,
  compact = false 
}) => {
  return (
    <div className="space-y-2">
      {data.map((hall, index) => (
        <div
          key={hall.name}
          onClick={() => onHallSelect(hall.name)}
          className={`${
            compact 
              ? 'p-2 bg-gray-50'
              : 'p-4 bg-gray-50'
          } rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>
                  {index + 1}.
                </span>
                <span className={`font-medium truncate ${compact ? 'text-sm' : 'text-base'}`}>
                  {hall.name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-bold text-[#041E42] ${compact ? 'text-lg' : 'text-xl'}`}>
                {hall.points}
              </span>
              <span className="text-gray-600 ml-1 text-xs">pts</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CumulativeLeaderboard;