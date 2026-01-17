import { addDays, startOfDay } from 'date-fns';

const generateDateRange = (startDate: Date, weeks: number): Date[] => {
  const start = startOfDay(startDate);
  const totalDays = weeks * 7;

  return Array.from({ length: totalDays + 1 }, (_, index) => addDays(start, index));
};

export default generateDateRange;
