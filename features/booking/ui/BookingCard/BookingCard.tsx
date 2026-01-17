'use client';

import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Kaisei_Tokumin } from 'next/font/google';
import type { Swiper as SwiperType } from 'swiper';
import {
  HorizontalSwiper,
  formatDateKey,
  formatDay2Digit,
  formatWeekdayShort,
  Button,
} from '../../../../shared';
import generateDateRange from '../../lib/dateRangeUtils';
import generateTimeSlots from '../../lib/timeRangeUtils';
import { useMonthLabels } from '../../model/useMonthLabels';
import styles from './BookingCard.module.scss';

const kaiseiTokumin = Kaisei_Tokumin({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

const WEEKS_TO_GENERATE = 6;

function BookingCard() {
  const dates = useMemo(() => generateDateRange(new Date(), WEEKS_TO_GENERATE), []);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | undefined>(undefined);
  const selectedDate = useMemo(
    () => (selectedIndex !== undefined ? dates[selectedIndex] : undefined),
    [selectedIndex, dates],
  );
  const timeSlots = useMemo(
    () => (selectedDate ? generateTimeSlots(selectedDate) : []),
    [selectedDate],
  );
  const [isDaysSwiperEnd, setIsDaysSwiperEnd] = useState(false);
  const [isDaysSwiperBeginning, setIsDaysSwiperBeginning] = useState(true);
  const [isTimeSwiperEnd, setIsTimeSwiperEnd] = useState(false);
  const [isTimeSwiperBeginning, setIsTimeSwiperBeginning] = useState(true);
  const dayRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const monthLabelRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const monthLabelsWrapperRef = useRef<HTMLDivElement>(null);

  const { monthLabels, updateMonthLabels } = useMonthLabels({
    dates,
    dayRefs,
    swiperContainerRef,
    swiperInstanceRef,
    monthLabelsWrapperRef,
    monthLabelRefs,
  });

  const handleLabelRef = useCallback((dayIndex: number) => (el: HTMLDivElement | null) => {
    if (el) {
      monthLabelRefs.current.set(dayIndex, el);
    } else {
      monthLabelRefs.current.delete(dayIndex);
    }
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex === index ? undefined : index;
      return newIndex;
    });
  }, []);

  useEffect(() => {
    setSelectedTimeIndex(undefined);
  }, [selectedIndex]);

  const handleDaysSwiperReachEnd = useCallback((isEnd: boolean) => {
    setIsDaysSwiperEnd(isEnd);
  }, []);

  const handleDaysSwiperReachBeginning = useCallback((isBeginning: boolean) => {
    setIsDaysSwiperBeginning(isBeginning);
  }, []);

  const handleTimeSelect = useCallback((index: number) => {
    setSelectedTimeIndex((prevIndex) => (prevIndex === index ? undefined : index));
  }, []);

  const handleTimeSwiperReachEnd = useCallback((isEnd: boolean) => {
    setIsTimeSwiperEnd(isEnd);
  }, []);

  const handleTimeSwiperReachBeginning = useCallback((isBeginning: boolean) => {
    setIsTimeSwiperBeginning(isBeginning);
  }, []);

  const handleSwiperReady = useCallback((swiper: SwiperType) => {
    swiperInstanceRef.current = swiper;
    updateMonthLabels();
  }, [updateMonthLabels]);

  const handleDayRef = useCallback((index: number) => (el: HTMLButtonElement | null) => {
    if (el) {
      dayRefs.current.set(index, el);
    } else {
      dayRefs.current.delete(index);
    }
  }, []);

  return (
    <section className={styles.card}>
      <div className={styles.infoRow}>
        <img
          className={styles.avatar}
          src="/avatar.jpg"
          alt="Session"
        />
        <div className={styles.infoText}>
          <h2 className={`${styles.infoTitle} ${kaiseiTokumin.className}`}>
            Book a Session
          </h2>
          <p className={styles.infoDescription}>
            Choose a date and time that is convenient for you to e-meet your
            stylist
          </p>
        </div>
      </div>
      <section className={`${styles.daysBlock} ${isDaysSwiperEnd ? styles.daysBlockEnd : ''} ${isDaysSwiperBeginning ? styles.daysBlockBeginning : ''}`}>
        <div ref={swiperContainerRef} className={styles.swiperContainer}>
          <div ref={monthLabelsWrapperRef} className={styles.monthLabelsWrapper}>
            {monthLabels.map(({
              dayIndex, monthName, position, isFixed,
            }) => (
              <div
                ref={handleLabelRef(dayIndex)}
                key={`month-${dayIndex}`}
                className={`${styles.monthLabel} ${
                  isFixed ? styles.monthLabelFixed : ''
                }`}
                style={{
                  left: `${position}px`,
                  transition: 'left 0.2s ease-out',
                }}
              >
                {monthName}
              </div>
            ))}
          </div>
          <HorizontalSwiper
            onSelect={handleSelect}
            onSlideChange={updateMonthLabels}
            onSwiperReady={handleSwiperReady}
            onReachEnd={handleDaysSwiperReachEnd}
            onReachBeginning={handleDaysSwiperReachBeginning}
            slidesPerView={6}
          >
            {dates.map((date, index) => {
              const dateKey = formatDateKey(date);
              const isSelected = selectedIndex === index;

              return (
                <button
                  ref={handleDayRef(index)}
                  className={`${styles.dayChip} ${isSelected ? styles.dayChipSelected : ''}`}
                  type="button"
                  key={dateKey}
                  data-day-index={index}
                >
                  <span className={styles.dayWeek}>
                    {formatWeekdayShort(date)}
                  </span>
                  <span className={styles.dayDate}>
                    {formatDay2Digit(date)}
                  </span>
                </button>
              );
            })}
          </HorizontalSwiper>
        </div>
      </section>
      {selectedDate && (
        <section className={`${styles.timeBlock} ${isTimeSwiperEnd ? styles.timeBlockEnd : ''} ${isTimeSwiperBeginning ? styles.timeBlockBeginning : ''}`}>
          <HorizontalSwiper
            onSelect={handleTimeSelect}
            onReachEnd={handleTimeSwiperReachEnd}
            onReachBeginning={handleTimeSwiperReachBeginning}
            slidesPerView={5}
            slidesPerGroup={1}
          >
            {timeSlots.map((slot, index) => {
              const isSelected = selectedTimeIndex === index;
              const isPast = slot.date.getTime() <= Date.now();

              return (
                <button
                  className={`${styles.timeChip} ${isSelected ? styles.timeChipSelected : ''}`}
                  type="button"
                  key={`${slot.date.getTime()}`}
                  disabled={isPast}
                >
                  {slot.time}
                </button>
              );
            })}
          </HorizontalSwiper>
        </section>
      )}

      <div className={styles.buttonWrapper}>
        <Button
          width={370}
          disabled={
            selectedIndex === undefined
            || selectedTimeIndex === undefined
            || (selectedTimeIndex !== undefined
              && (timeSlots[selectedTimeIndex]?.date.getTime() ?? 0) <= Date.now())
          }
          onClick={() => {
            if (selectedIndex !== undefined && selectedTimeIndex !== undefined) {
              const selectedTimeSlot = timeSlots[selectedTimeIndex];
              const timestamp = selectedTimeSlot.date.getTime();
              // eslint-disable-next-line no-console
              console.log(timestamp);
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </section>
  );
}

export default BookingCard;
