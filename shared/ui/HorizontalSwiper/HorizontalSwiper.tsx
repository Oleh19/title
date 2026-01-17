'use client';

import React, {
  Children, isValidElement, useCallback, useId, useRef, useState, type ReactNode,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import SwiperNavButton from '../SwiperNavigation/SwiperNavButton';
import styles from './HorizontalSwiper.module.scss';

const SPACE_BETWEEN_SLIDES = 8;
const SLIDES_PER_GROUP = 1;

const getSlideKey = (child: unknown, baseId: string, index: number): string | number => (
  isValidElement(child) && child.key
    ? child.key
    : `${baseId}-slide-${index}`
);

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

  const handleSelect = useCallback((index: number) => {
    onSelect?.(index);
  }, [onSelect]);

  const handleSlideClick = useCallback((index: number) => () => {
    handleSelect(index);
  }, [handleSelect]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setCanScrollLeft(!swiper.isBeginning);
    setCanScrollRight(!swiper.isEnd);
    onSlideChange?.();
  }, [onSlideChange]);

  const handleSwiperReady = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    handleSlideChange(swiper);
    onSwiperReady?.(swiper);
  }, [handleSlideChange, onSwiperReady]);

  const handleSlidePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleSlideNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  return (
    <div className={styles.wrapper}>
      <SwiperNavButton
        direction="prev"
        onClick={handleSlidePrev}
        disabled={!canScrollLeft}
      />
      <Swiper
        spaceBetween={SPACE_BETWEEN_SLIDES}
        slidesPerView="auto"
        slidesPerGroup={SLIDES_PER_GROUP}
        onSwiper={handleSwiperReady}
        onSlideChange={handleSlideChange}
        onSlideChangeTransitionEnd={handleSlideChange}
        className={styles.swiper}
      >
        {childrenArray.map((child, index) => (
          <SwiperSlide
            key={getSlideKey(child, baseId, index)}
            className={styles.slide}
            onClick={handleSlideClick(index)}
          >
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      <SwiperNavButton
        direction="next"
        onClick={handleSlideNext}
        disabled={!canScrollRight}
      />
    </div>
  );
}

HorizontalSwiper.defaultProps = {
  onSlideChange: undefined,
  onSelect: undefined,
  onSwiperReady: undefined,
};

export default HorizontalSwiper;
