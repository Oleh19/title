const DEFAULT_LOCALE = 'en-US';

const monthFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, { month: 'short' });
const weekdayFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, { weekday: 'short' });
const dayFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, { day: '2-digit' });

export const getMonthKey = (date: Date): number => date.getFullYear() * 12 + date.getMonth();

export const formatMonthShort = (date: Date): string => monthFormatter.format(date);

export const formatWeekdayShort = (date: Date): string => weekdayFormatter.format(date);

export const formatDay2Digit = (date: Date): string => dayFormatter.format(date);

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const formatDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
