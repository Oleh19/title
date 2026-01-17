const LOCALE = 'en-US' as const;

const monthFormatter = new Intl.DateTimeFormat(LOCALE, { month: 'short' });
const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, { weekday: 'short' });
const dayFormatter = new Intl.DateTimeFormat(LOCALE, { day: '2-digit' });

export const getMonthKey = (date: Date): number => date.getFullYear() * 12 + date.getMonth();

export const formatMonthShort = (date: Date): string => monthFormatter.format(date);

export const formatWeekdayShort = (date: Date): string => weekdayFormatter.format(date);

export const formatDay2Digit = (date: Date): string => dayFormatter.format(date);
