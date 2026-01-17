const START_HOUR = 9;
const END_HOUR = 18;

const formatTime = (hour: number): string => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const generateTimeRange = (startHour: number, endHour: number): string[] => {
  const times: string[] = [];

  for (let hour = startHour; hour < endHour; hour += 1) {
    times.push(formatTime(hour));
  }

  return times;
};

const generateTimeSlots = (): string[] => generateTimeRange(START_HOUR, END_HOUR);

export default generateTimeSlots;
