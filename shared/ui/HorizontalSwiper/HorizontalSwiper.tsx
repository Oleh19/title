'use client';

import React, { Children, isValidElement, useId, useRef, useState, type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from '../icons';
import styles from './HorizontalSwiper.module.scss';

type HorizontalSwiperProps = {
  children: ReactNode;
  onSlideChange?: () => void;
  onSelect?: (index: number) => void;
  onSwiperReady?: (swiper: SwiperType) => void;
};
function HorizontalSwiper({
  children,
  onSlideChange,
  onSelect,
  onSwiperReady,
}: HorizontalSwiperProps) {
  const baseId = useId();
  const childrenArray = Children.toArray(children);
  const swiperRef = useRef<SwiperType | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleSelect = (index: number) => {
    if (onSelect) {
      onSelect(index);
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCanScrollLeft(!swiper.isBeginning);
    setCanScrollRight(!swiper.isEnd);
    if (onSlideChange) {
      onSlideChange();
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        type="button"
        aria-label="Scroll left"
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={!canScrollLeft}
      >
        <ArrowLeft />
      </button>
      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView="auto"
        slidesPerGroup={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleSlideChange(swiper);
          if (onSwiperReady) {
            onSwiperReady(swiper);
          }
        }}
        onSlideChange={handleSlideChange}
        onSlideChangeTransitionEnd={handleSlideChange}
        className={styles.swiper}
      >
        {childrenArray.map((child, index) => {
          const key = isValidElement(child) && child.key
            ? child.key
            : `${baseId}-slide-${index}`;
          return (
            <SwiperSlide
              key={key}
              className={styles.slide}
              onClick={() => handleSelect(index)}
            >
              {child}
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        className={styles.button}
        type="button"
        aria-label="Scroll right"
        onClick={() => swiperRef.current?.slideNext()}
        disabled={!canScrollRight}
      >
        <ArrowRight />
      </button>
    </div>
  );
}

HorizontalSwiper.defaultProps = {
  onSlideChange: undefined,
  onSelect: undefined,
  onSwiperReady: undefined,
};

export default HorizontalSwiper;
