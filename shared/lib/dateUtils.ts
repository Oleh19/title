const LOCALE = 'en-US' as const;

const monthFormatter = new Intl.DateTimeFormat(LOCALE, { month: 'short' });
const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, { weekday: 'short' });
const dayFormatter = new Intl.DateTimeFormat(LOCALE, { day: '2-digit' });

const generateDateRange = (startDate: Date, weeks: number): Date[] => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const totalDays = weeks * 7;

  return Array.from({ length: totalDays + 1 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export const getMonthKey = (date: Date): number => date.getFullYear() * 12 + date.getMonth();

export const formatMonthShort = (date: Date): string => monthFormatter.format(date);

export const formatWeekdayShort = (date: Date): string => weekdayFormatter.format(date);

export const formatDay2Digit = (date: Date): string => dayFormatter.format(date);

export default generateDateRange;
