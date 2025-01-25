import React from 'react';
import { ProcessedData, ResourceType } from '../types';
import { formatNumber, getResourceUnit } from '../utils';
import { Trophy } from 'lucide-react';

interface RankingListProps {
  data: ProcessedData;
  resource: ResourceType;
  onHallSelect: (hall: string) => void;
}

const RankingList: React.FC<RankingListProps> = ({ data, resource, onHallSelect }) => {
  const sortedHalls = Object.entries(data)
    .sort(([, a], [, b]) => a[resource] - b[resource])
    .map(([name, values]) => ({
      name,
      value: values[resource],
      points: values.points[resource],
      totalPoints: values.points.total
    }));

  return (
    <div className="space-y-4">
      {sortedHalls.map((hall, index) => (
        <div
          key={hall.name}
          onClick={() => onHallSelect(hall.name)}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {index < 3 && (
                <Trophy
                  className={`h-6 w-6 ${
                    index === 0
                      ? 'text-yellow-400'
                      : index === 1
                      ? 'text-gray-400'
                      : 'text-amber-600'
                  }`}
                />
              )}
              <span className="font-medium text-lg">{index + 1}.</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{hall.name}</span>
                  {hall.points > 0 && (
                    <span className="text-green-600 font-medium">+{hall.points}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Total Points {hall.totalPoints}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">
                {formatNumber(hall.value)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {getResourceUnit(resource)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RankingList;