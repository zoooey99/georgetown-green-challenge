import React from 'react';
import { X } from 'lucide-react';
import { ProcessedData } from '../types';
import { formatNumber, getResourceUnit } from '../utils';

interface HallDashboardProps {
  hallName: string;
  data: ProcessedData;
  onClose: () => void;
}

const HallDashboard: React.FC<HallDashboardProps> = ({
  hallName,
  data,
  onClose,
}) => {
  const hallData = data[hallName];
  const weeklyHistory = hallData.weeklyHistory;

  // Calculate min and max values for each resource
  const resourceRanges = {
    electricity: {
      min: Math.min(...weeklyHistory.map(w => w.metrics.electricity)),
      max: Math.max(...weeklyHistory.map(w => w.metrics.electricity))
    },
    gas: {
      min: Math.min(...weeklyHistory.map(w => w.metrics.gas)),
      max: Math.max(...weeklyHistory.map(w => w.metrics.gas))
    },
    water: {
      min: Math.min(...weeklyHistory.map(w => w.metrics.water)),
      max: Math.max(...weeklyHistory.map(w => w.metrics.water))
    }
  };

  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 40, bottom: 30, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate points for each resource line
  const generatePoints = (resource: keyof typeof resourceRanges) => {
    return weeklyHistory.map((week, index) => {
      const x = (index / (weeklyHistory.length - 1)) * chartWidth + padding.left;
      const range = resourceRanges[resource];
      const normalized = (week.metrics[resource] - range.min) / (range.max - range.min);
      const y = chartHeight - (normalized * chartHeight) + padding.top;
      return `${x},${y}`;
    }).join(' ');
  };

  // Generate axis ticks
  const yAxisTicks = (resource: keyof typeof resourceRanges) => {
    const range = resourceRanges[resource];
    const ticks = 5;
    return Array.from({ length: ticks }, (_, i) => {
      const value = range.min + ((range.max - range.min) * i) / (ticks - 1);
      const y = chartHeight - ((value - range.min) / (range.max - range.min)) * chartHeight + padding.top;
      return { value: Math.round(value), y };
    });
  };

  const colors = {
    electricity: '#2563eb', // blue-600
    gas: '#dc2626', // red-600
    water: '#059669' // emerald-600
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{hallName}</h2>
            <p className="text-gray-600">Total Points {hallData.points.total}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(hallData)
            .filter(([key]) => key !== 'points' && key !== 'weeklyHistory')
            .map(([resource, value]) => (
              <div
                key={resource}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold capitalize">
                    {resource}
                  </h3>
                  {hallData.points[resource as keyof typeof hallData.points] > 0 && (
                    <span className="text-green-600 font-medium">
                      +{hallData.points[resource as keyof typeof hallData.points]}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold">
                  {formatNumber(value)}
                  <span className="text-sm text-gray-500 ml-2">
                    {getResourceUnit(resource as any)}
                  </span>
                </p>
              </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Weekly Resource Consumption</h3>
          <div className="relative">
            <svg width={width} height={height} className="overflow-visible">
              {/* Grid lines */}
              {Array.from({ length: 6 }, (_, i) => (
                <line
                  key={`grid-${i}`}
                  x1={padding.left}
                  y1={padding.top + (chartHeight * i) / 5}
                  x2={width - padding.right}
                  y2={padding.top + (chartHeight * i) / 5}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* X-axis */}
              <line
                x1={padding.left}
                y1={height - padding.bottom}
                x2={width - padding.right}
                y2={height - padding.bottom}
                stroke="#9ca3af"
                strokeWidth="2"
              />

              {/* Y-axis */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={height - padding.bottom}
                stroke="#9ca3af"
                strokeWidth="2"
              />

              {/* Resource lines */}
              {(Object.keys(resourceRanges) as Array<keyof typeof resourceRanges>).map(resource => (
                <g key={resource}>
                  <path
                    d={`M ${generatePoints(resource)}`}
                    fill="none"
                    stroke={colors[resource]}
                    strokeWidth="2"
                  />
                  {/* Data points */}
                  {weeklyHistory.map((week, index) => {
                    const x = (index / (weeklyHistory.length - 1)) * chartWidth + padding.left;
                    const range = resourceRanges[resource];
                    const normalized = (week.metrics[resource] - range.min) / (range.max - range.min);
                    const y = chartHeight - (normalized * chartHeight) + padding.top;
                    return (
                      <circle
                        key={`${resource}-${index}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={colors[resource]}
                      />
                    );
                  })}
                </g>
              ))}

              {/* X-axis labels */}
              {weeklyHistory.map((week, index) => (
                <text
                  key={`week-${index}`}
                  x={(index / (weeklyHistory.length - 1)) * chartWidth + padding.left}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  W{week.weekNumber}
                </text>
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute top-0 right-0 flex gap-4">
              {(Object.keys(resourceRanges) as Array<keyof typeof resourceRanges>).map(resource => (
                <div key={resource} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[resource] }}
                  />
                  <span className="text-sm capitalize">{resource}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallDashboard;