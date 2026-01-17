const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const generateDateRange = (startDate: Date, weeks: number): Date[] => {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const totalDays = weeks * 7;

  return Array.from({ length: totalDays + 1 }, (_, index) => (
    new Date(start.getTime() + index * MILLISECONDS_PER_DAY)
  ));
};

export default generateDateRange;
