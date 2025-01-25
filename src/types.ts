export interface ConsumptionData {
  startDateTime: string;
  endDateTime: string;
  [key: string]: string | number;
}

export interface HallData {
  electricity: number;
  gas: number;
  water: number;
  points: {
    electricity: number;
    gas: number;
    water: number;
    total: number;
  };
  weeklyHistory: WeeklyData[];
}

export interface WeeklyData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  metrics: {
    electricity: number;
    gas: number;
    water: number;
  };
  points: {
    electricity: number;
    gas: number;
    water: number;
    total: number;
  };
}

export interface ProcessedData {
  [hallName: string]: HallData;
}

export type ResourceType = 'electricity' | 'gas' | 'water';

export interface HallDetails {
  name: string;
  value: number;
  unit: string;
}

export interface TimelineEvent {
  weekNumber: number;
  startDate: string;
  endDate: string;
  isCurrentWeek: boolean;
  isFuture: boolean;
}

export interface ChartData {
  weekNumber: number;
  date: string;
  points: number;
}

export interface CumulativeData {
  name: string;
  points: number;
}