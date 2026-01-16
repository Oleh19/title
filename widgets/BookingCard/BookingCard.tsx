'use client';

import React, { useRef, useState } from 'react';
import { Kaisei_Tokumin } from 'next/font/google';
import type { Swiper as SwiperType } from 'swiper';
import HorizontalSwiper from '../../shared/ui/HorizontalSwiper';
import generateDateRange, {
  formatWeekdayShort,
  formatDay2Digit,
} from '../../shared/lib/dateUtils';
import { useMonthLabels } from '../../shared/hooks/useMonthLabels';
import styles from './BookingCard.module.scss';

const kaiseiTokumin = Kaisei_Tokumin({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

function BookingCard() {
  const dates = generateDateRange(new Date(), 6);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
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
      <section className={styles.daysBlock}>
        <div ref={swiperContainerRef} className={styles.swiperContainer}>
          <div ref={monthLabelsWrapperRef} className={styles.monthLabelsWrapper}>
            {monthLabels.map(({
              dayIndex, monthName, position, isFixed,
            }) => (
              <div
                ref={(el) => {
                  if (el) {
                    monthLabelRefs.current.set(dayIndex, el);
                  } else {
                    monthLabelRefs.current.delete(dayIndex);
                  }
                }}
                key={`month-${dayIndex}`}
                className={`${styles.monthLabel} ${
                  isFixed ? styles.monthLabelFixed : ''
                }`}
                style={{
                  left: `${position}px`,
                }}
              >
                {monthName}
              </div>
            ))}
          </div>
          <HorizontalSwiper
            onSelect={(index) => setSelectedIndex(selectedIndex === index ? undefined : index)}
            onSlideChange={updateMonthLabels}
            onSwiperReady={(swiper) => {
              swiperInstanceRef.current = swiper;
              updateMonthLabels();
            }}
          >
            {dates.map((date, index) => {
              const dateKey = date.toISOString();
              const isSelected = selectedIndex === index;

              return (
                <button
                  ref={(el) => {
                    if (el) {
                      dayRefs.current.set(index, el);
                    } else {
                      dayRefs.current.delete(index);
                    }
                  }}
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
    </section>
  );
}

export default BookingCard;
