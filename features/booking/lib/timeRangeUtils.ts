const START_HOUR = 9;
const END_HOUR = 18;
const MINUTES_INTERVAL = 15;
const MINUTES_PER_HOUR = 60;

const formatTime = (date: Date): string => new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}).format(date);

const generateTimeSlots = (selectedDate?: Date): { time: string; date: Date }[] => {
  const now = new Date();
  const baseDate = selectedDate || now;

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const minutes = Array.from(
    { length: MINUTES_PER_HOUR / MINUTES_INTERVAL },
    (_, i) => i * MINUTES_INTERVAL,
  );

  return hours.flatMap((hour) => minutes.map((minute) => {
    const slotDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hour,
      minute,
    );

    return {
      time: formatTime(slotDate),
      date: slotDate,
    };
  })).filter((slot) => slot.date > now);
};

export default generateTimeSlots;
