import { ConsumptionData, ProcessedData, ResourceType, TimelineEvent, ChartData, CumulativeData } from './types';
import { buildingSizes } from './data/buildingSizes';

const calculatePoints = (position: number): number => {
  switch (position) {
    case 0: return 3; // 1st place
    case 1: return 2; // 2nd place
    case 2: return 1; // 3rd place
    default: return 0;
  }
};

const resources: ResourceType[] = ['electricity', 'gas', 'water'];

export const getCurrentWeek = (data: ConsumptionData[]): number => {
  const now = new Date();
  return data.findIndex(week => {
    const weekStart = new Date(week.startDateTime);
    const weekEnd = new Date(week.endDateTime);
    return now >= weekStart && now <= weekEnd;
  });
};

export const generateTimelineEvents = (data: ConsumptionData[]): TimelineEvent[] => {
  // Generate all weeks from January through first week of May
  const startDate = new Date('2024-01-08');
  const endDate = new Date('2024-05-07');
  const events: TimelineEvent[] = [];
  let weekNumber = 1;
  const now = new Date();
  
  while (startDate <= endDate) {
    const weekEndDate = new Date(startDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    
    const isCurrentWeek = now >= startDate && now <= weekEndDate;
    const hasData = weekNumber <= data.length;
    
    events.push({
      weekNumber,
      startDate: startDate.toISOString(),
      endDate: weekEndDate.toISOString(),
      isCurrentWeek,
      isFuture: !hasData
    });
    
    startDate.setDate(startDate.getDate() + 7);
    weekNumber++;
  }
  
  return events;
};

const calculatePerSqFt = (value: number, hallName: string): number => {
  const size = buildingSizes[hallName];
  if (!size) return value;
  return value / size;
};

export const calculateWeeklyPoints = (weekData: ConsumptionData, hallName: string): number => {
  let totalPoints = 0;
  resources.forEach(resource => {
    const resourceKey = resource.charAt(0).toUpperCase() + resource.slice(1);
    const hallValues = Object.entries(weekData)
      .filter(([key]) => key.includes(` - ${resourceKey}`))
      .map(([key, value]) => ({
        hall: key.split(' - ')[0],
        value: calculatePerSqFt(Number(value), key.split(' - ')[0])
      }))
      .sort((a, b) => a.value - b.value);

    const position = hallValues.findIndex(h => h.hall === hallName);
    totalPoints += calculatePoints(position);
  });
  return totalPoints;
};

export const calculateCumulativeScores = (data: ConsumptionData[]): CumulativeData[] => {
  const hallScores = new Map<string, number[]>();

  if (data[0]) {
    const halls = new Set<string>();
    Object.keys(data[0]).forEach(key => {
      if (key.includes(' - ')) {
        const hallName = key.split(' - ')[0];
        halls.add(hallName);
      }
    });
    halls.forEach(hallName => {
      hallScores.set(hallName, []);
    });
  }

  // Calculate weekly points and build cumulative totals
  data.forEach((week, weekIndex) => {
    hallScores.forEach((scores, hallName) => {
      const weeklyPoints = calculateWeeklyPoints(week, hallName);
      const previousTotal = weekIndex > 0 ? scores[weekIndex - 1] : 0;
      scores.push(previousTotal + weeklyPoints);
    });
  });

  return Array.from(hallScores.entries())
    .map(([name, scores]) => ({
      name,
      points: scores[scores.length - 1] || 0,
      weeklyScores: scores
    }))
    .sort((a, b) => b.points - a.points);
};

export const generateChartData = (
  data: ConsumptionData[],
  hallName: string
): ChartData[] => {
  const cumulativePoints: number[] = [];
  
  return data.map((week, index) => {
    const weeklyPoints = calculateWeeklyPoints(week, hallName);
    const cumulativeTotal = index === 0 ? weeklyPoints : cumulativePoints[index - 1] + weeklyPoints;
    cumulativePoints.push(cumulativeTotal);
    
    return {
      weekNumber: index + 1,
      date: week.startDateTime,
      points: cumulativeTotal
    };
  });
};

export const processData = (data: ConsumptionData[]): ProcessedData => {
  if (!data.length) return {};
  
  const currentWeek = data[data.length - 1];
  const halls: ProcessedData = {};

  // First, initialize all halls from the data
  Object.keys(currentWeek).forEach(key => {
    if (key.includes(' - ')) {
      const hallName = key.split(' - ')[0];
      if (!halls[hallName]) {
        halls[hallName] = {
          electricity: 0,
          gas: 0,
          water: 0,
          points: {
            electricity: 0,
            gas: 0,
            water: 0,
            total: 0
          },
          weeklyHistory: []
        };
      }
    }
  });

  // Then populate the current values with per square foot calculations
  Object.entries(currentWeek).forEach(([key, value]) => {
    if (key.includes(' - ')) {
      const [hallName, resourceInfo] = key.split(' - ');
      const resourceType = resourceInfo.split(' : ')[0].toLowerCase() as ResourceType;
      halls[hallName][resourceType] = calculatePerSqFt(Number(value), hallName);
    }
  });

  // Calculate points for each resource
  resources.forEach(resource => {
    const sortedHalls = Object.entries(halls)
      .sort(([, a], [, b]) => a[resource] - b[resource]);

    sortedHalls.forEach(([hallName, _], index) => {
      halls[hallName].points[resource] = calculatePoints(index);
    });
  });

  // Calculate weekly history and total points
  Object.keys(halls).forEach(hallName => {
    const cumulativeData = generateChartData(data, hallName);
    const latestCumulative = cumulativeData[cumulativeData.length - 1]?.points || 0;
    
    halls[hallName].points.total = latestCumulative;
    halls[hallName].weeklyHistory = data.map((week, index) => ({
      weekNumber: index + 1,
      startDate: week.startDateTime,
      endDate: week.endDateTime,
      metrics: {
        electricity: calculatePerSqFt(Number(week[`${hallName} - Electricity : kW`] || 0), hallName),
        gas: calculatePerSqFt(Number(week[`${hallName} - Gas : therm`] || 0), hallName),
        water: calculatePerSqFt(Number(week[`${hallName} - Water : US gal/min`] || 0), hallName)
      },
      points: {
        electricity: 0,
        gas: 0,
        water: 0,
        total: cumulativeData[index]?.points || 0
      }
    }));
  });

  return halls;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const getResourceUnit = (resource: ResourceType): string => {
  switch (resource) {
    case 'electricity':
      return 'kW/sq ft';
    case 'gas':
      return 'therm/sq ft';
    case 'water':
      return 'gal/min/sq ft';
  }
};