import React, { useEffect, useRef } from 'react';
import { TimelineEvent } from '../types';
import { Lock, AlertCircle } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  onWeekSelect: (weekNumber: number) => void;
  selectedWeek: number;
}

const Timeline: React.FC<TimelineProps> = ({ events, onWeekSelect, selectedWeek }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const prevEventsLength = useRef(events.length);

  useEffect(() => {
    // Check if new events were added
    if (events.length > prevEventsLength.current) {
      const newEventElement = timelineRef.current?.children[events.length - 1];
      newEventElement?.classList.add('animate-pulse');
      
      // Remove animation after 3 seconds
      setTimeout(() => {
        newEventElement?.classList.remove('animate-pulse');
      }, 3000);
    }
    prevEventsLength.current = events.length;
  }, [events]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Validate timeline integrity
  const hasTimelineGaps = events.some((event, index) => {
    if (index === 0) return false;
    const currentStart = new Date(event.startDate);
    const prevEnd = new Date(events[index - 1].endDate);
    const timeDiff = currentStart.getTime() - prevEnd.getTime();
    return timeDiff > 86400000; // More than 1 day gap
  });

  if (hasTimelineGaps) {
    return (
      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="h-5 w-5" />
          <h2 className="font-medium">Timeline Data Error</h2>
        </div>
        <p className="text-sm text-red-600">
          Timeline data contains gaps between weeks. Please contact the administrator to resolve this issue.
        </p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <AlertCircle className="h-5 w-5" />
          <h2 className="font-medium">No Timeline Data</h2>
        </div>
        <p className="text-sm text-gray-600">
          Timeline data is currently unavailable. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 relative z-0">
      <h2 className="text-2xl font-serif text-[#041E42] mb-4">Competition Timeline</h2>
      <div className="relative" ref={timelineRef}>
        {/* Progress Line */}
        <div className="absolute h-1 bg-gray-200 top-[2.25rem] left-0 right-0" />
        
        {/* Weeks */}
        <div className="relative flex justify-between">
          {events.map((event) => {
            const eventStartDate = new Date(event.startDate);
            const noDataWeek = event.isFuture;
            const isPast = !event.isFuture;
            const isSelected = selectedWeek === event.weekNumber;

            return (
              <div
                key={event.weekNumber}
                className={`flex flex-col items-center transition-all duration-300 ${
                  noDataWeek ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
                onClick={() => !noDataWeek && onWeekSelect(event.weekNumber)}
              >
                {/* Week Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                    ${isSelected
                      ? 'bg-[#041E42] text-white scale-110 shadow-lg'
                      : event.isCurrentWeek
                      ? 'bg-green-500 text-white'
                      : noDataWeek
                      ? 'bg-gray-800 text-gray-300'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }
                    ${noDataWeek ? 'shadow-inner' : ''}
                  `}
                >
                  {noDataWeek ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">W{event.weekNumber}</span>
                  )}
                </div>

                {/* Date */}
                <div
                  className={`text-xs ${
                    noDataWeek
                      ? 'text-gray-500'
                      : isPast
                      ? 'text-gray-500'
                      : 'text-gray-700'
                  }`}
                >
                  {formatDate(event.startDate)}
                </div>

                {/* Current Week Indicator */}
                {event.isCurrentWeek && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full whitespace-nowrap shadow-sm">
                      Current Week
                    </div>
                  </div>
                )}

                {/* Cutoff Date Indicator */}
                {eventStartDate.toDateString() === new Date('2024-03-24').toDateString() && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="px-2 py-1 bg-[#041E42] text-white text-xs rounded-full shadow-sm">
                      Competition Cutoff
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;