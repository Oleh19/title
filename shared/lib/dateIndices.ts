import { getMonthKey } from './dateUtils';

export const getFirstDayIndices = (dates: Date[]): number[] => dates.reduce<number[]>(
  (indices, date, index) => {
    if (index === 0 || getMonthKey(date) !== getMonthKey(dates[index - 1])) {
      return [...indices, index];
    }
    return indices;
  },
  [],
);

export const getLastDayIndices = (dates: Date[]): number[] => dates.reduce<number[]>(
  (indices, date, index) => {
    const isLast = index === dates.length - 1;
    const isLastOfMonth = !isLast && getMonthKey(date) !== getMonthKey(dates[index + 1]);
    if (isLast || isLastOfMonth) {
      return [...indices, index];
    }
    return indices;
  },
  [],
);
