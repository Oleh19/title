const START_HOUR = 0;
const END_HOUR = 24;
const MINUTES_INTERVAL = 15;
const MINUTES_PER_HOUR = 60;

const DEFAULT_LOCALE = 'en-US';

const formatTime = (date: Date): string => new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}).format(date);

const generateTimeSlots = (selectedDate?: Date): { time: string; date: Date }[] => {
  const baseDate = selectedDate || new Date();

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const minutes = Array.from(
    { length: MINUTES_PER_HOUR / MINUTES_INTERVAL },
    (_, i) => i * MINUTES_INTERVAL,
  );

  const regularSlots = hours.flatMap((hour) => minutes.map((minute) => {
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
  }));

  const lastSlotDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    23,
    59,
  );

  const lastSlot = {
    time: formatTime(lastSlotDate),
    date: lastSlotDate,
  };

  return [...regularSlots, lastSlot];
};

export default generateTimeSlots;
