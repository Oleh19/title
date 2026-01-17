'use client';

import React, { useRef, type ReactNode } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import HorizontalSwiper from '../HorizontalSwiper';
import { useMonthLabels, type MonthLabel } from '../../hooks/useMonthLabels';
import styles from './SwiperWrapper.module.scss';

type SwiperWrapperProps = {
  dates: Date[];
  renderDay: (date: Date, index: number, ref: (el: HTMLElement | null) => void) => ReactNode;
  onSelect?: (index: number) => void;
  renderLabel?: (label: MonthLabel) => ReactNode;
};

function SwiperWrapper({
  dates,
  renderDay,
  onSelect,
  renderLabel,
}: SwiperWrapperProps) {
  const dayRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const labelRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const labelsWrapperRef = useRef<HTMLDivElement>(null);

  const { monthLabels, updateMonthLabels } = useMonthLabels({
    dates,
    dayRefs,
    swiperContainerRef,
    swiperInstanceRef,
    monthLabelsWrapperRef: labelsWrapperRef,
    monthLabelRefs: labelRefs,
  });

  const defaultRenderLabel = (label: MonthLabel) => (
    <div
      ref={(el) => {
        if (el) {
          labelRefs.current.set(label.dayIndex, el);
        } else {
          labelRefs.current.delete(label.dayIndex);
        }
      }}
      key={`label-${label.dayIndex}`}
      className={`${styles.label} ${
        label.isFixed ? styles.labelFixed : ''
      }`}
      style={{
        left: `${label.position}px`,
      }}
    >
      {label.monthName}
    </div>
  );

  return (
    <div ref={swiperContainerRef} className={styles.swiperContainer}>
      <div ref={labelsWrapperRef} className={styles.labelsWrapper}>
        {monthLabels.map((label) => (
          renderLabel ? renderLabel(label) : defaultRenderLabel(label)
        ))}
      </div>
      <HorizontalSwiper
        onSelect={onSelect}
        onSlideChange={updateMonthLabels}
        onSwiperReady={(swiper) => {
          swiperInstanceRef.current = swiper;
          updateMonthLabels();
        }}
      >
        {dates.map((date, index) => {
          const dayRef = (el: HTMLElement | null) => {
            if (el) {
              dayRefs.current.set(index, el as HTMLButtonElement);
            } else {
              dayRefs.current.delete(index);
            }
          };
          return renderDay(date, index, dayRef);
        })}
      </HorizontalSwiper>
    </div>
  );
}

export default SwiperWrapper;
