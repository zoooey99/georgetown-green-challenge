import { ConsumptionData } from '../types';

// Generate weekly data from January to March
const generateHistoricalData = (): ConsumptionData[] => {
  const weeks: ConsumptionData[] = [];
  const startDate = new Date('2024-01-08');
  const endDate = new Date('2024-03-31');
  
  while (startDate <= endDate) {
    const weekEndDate = new Date(startDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    
    const weekData: ConsumptionData = {
      startDateTime: startDate.toISOString(),
      endDateTime: weekEndDate.toISOString(),
    };

    // Generate random variations of the base metrics for each hall
    const halls = [
      'Darnall Hall', 'Harbin Hall', 'New South Hall', 'Village C West',
      'Village C East', 'Copley Hall', 'Kennedy Hall', 'McCarthy Hall',
      'Reynolds Hall', 'Ryan Hall', 'Pedro Arrupe Hall', 'Henle Village',
      'LXR', 'Nevils', 'Alumni Square', 'Village A', 'Village B',
      'Magis Row', 'Ida Ryan Hall', 'Isaac Hawkins Hall'
    ];

    halls.forEach(hall => {
      const baseElectricity = 100000 + Math.random() * 50000;
      const baseGas = 2000 + Math.random() * 3000;
      const baseWater = 20000 + Math.random() * 60000;

      weekData[`${hall} - Electricity : kW`] = Math.round(baseElectricity * (0.8 + Math.random() * 0.4));
      weekData[`${hall} - Gas : therm`] = Math.round(baseGas * (0.8 + Math.random() * 0.4));
      weekData[`${hall} - Water : US gal/min`] = Math.round(baseWater * (0.8 + Math.random() * 0.4));
    });

    weeks.push(weekData);
    startDate.setDate(startDate.getDate() + 7);
  }

  return weeks;
};

export const historicalData = generateHistoricalData();