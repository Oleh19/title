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

export default generateDateRange;
