'use client';

import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { Kaisei_Tokumin } from 'next/font/google';
import type { Swiper as SwiperType } from 'swiper';
import {
  HorizontalSwiper,
  formatWeekdayShort,
  formatDay2Digit,
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
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | undefined>(undefined);
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
    setSelectedIndex((prevIndex) => (prevIndex === index ? undefined : index));
  }, []);

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
              const dateKey = date.toISOString();
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
      <section className={`${styles.timeBlock} ${isTimeSwiperEnd ? styles.timeBlockEnd : ''} ${isTimeSwiperBeginning ? styles.timeBlockBeginning : ''}`}>
        <HorizontalSwiper
          onSelect={handleTimeSelect}
          onReachEnd={handleTimeSwiperReachEnd}
          onReachBeginning={handleTimeSwiperReachBeginning}
          slidesPerView={5}
          slidesPerGroup={1}
        >
          {timeSlots.map((time, index) => {
            const isSelected = selectedTimeIndex === index;

            return (
              <button
                className={`${styles.timeChip} ${isSelected ? styles.timeChipSelected : ''}`}
                type="button"
                key={time}
              >
                {time}
              </button>
            );
          })}
        </HorizontalSwiper>
      </section>
    </section>
  );
}

export default BookingCard;
