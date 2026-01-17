import type { Swiper as SwiperType } from 'swiper';
import type { RefObject } from 'react';
import {
  getMonthKey,
  formatMonthShort,
  isSlideVisible,
  checkSlideVisibility,
  getElementPosition,
} from '../../../shared';
import type { MonthLabel } from '../model/useMonthLabels';

const getSlideRect = (slide: Element): DOMRect => {
  if (!(slide instanceof HTMLElement)) {
    const emptyRect = new DOMRect(0, 0, 0, 0);
    return emptyRect;
  }
  return slide.getBoundingClientRect();
};

export const findLeftmostVisibleDay = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  dates: Date[],
): { dayIndex: number; monthKey: number } | null => {
  const result = dates.reduce<{ dayIndex: number; monthKey: number; position: number } | null>(
    (leftmost, date, index) => {
      const slide = swiper.slides[index];
      if (!slide) return leftmost;

      const slideRect = getSlideRect(slide);
      const position = slideRect.left - swiperRect.left;

      if (isSlideVisible(slideRect, swiperRect) && (!leftmost || position < leftmost.position)) {
        return {
          dayIndex: index,
          monthKey: getMonthKey(date),
          position,
        };
      }

      return leftmost;
    },
    null,
  );

  return result ? { dayIndex: result.dayIndex, monthKey: result.monthKey } : null;
};

export const findLeftmostFirstDay = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  visibleSlides: unknown[],
  firstDayIndices: number[],
): { dayIndex: number; position: number } | null => firstDayIndices.reduce<
{ dayIndex: number; position: number } | null
>(
  (leftmost, dayIndex) => {
    const slide = swiper.slides[dayIndex];
    if (!slide) return leftmost;

    const slideRect = getSlideRect(slide);
    const position = slideRect.left - swiperRect.left;

    if (checkSlideVisibility(dayIndex, slideRect, swiperRect, visibleSlides)) {
      if (!leftmost || position < leftmost.position) {
        return { dayIndex, position };
      }
    }

    return leftmost;
  },
  null,
);

export const findLeftmostLastDay = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  visibleSlides: unknown[],
  lastDayIndices: number[],
  dates: Date[],
): { dayIndex: number; position: number; monthKey: number } | null => lastDayIndices.reduce<
{ dayIndex: number; position: number; monthKey: number } | null
>(
  (leftmost, dayIndex) => {
    const slide = swiper.slides[dayIndex];
    if (!slide) return leftmost;

    const slideRect = getSlideRect(slide);
    const position = slideRect.left - swiperRect.left;

    if (checkSlideVisibility(dayIndex, slideRect, swiperRect, visibleSlides)) {
      const monthKey = getMonthKey(dates[dayIndex]);
      if (!leftmost || position < leftmost.position) {
        return { dayIndex, position, monthKey };
      }
    }

    return leftmost;
  },
  null,
);

export const hasFixedMonthVisibleDays = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  dates: Date[],
  fixedMonthIndex: number | null,
): boolean => {
  if (fixedMonthIndex === null) return false;

  const fixedMonthKey = getMonthKey(dates[fixedMonthIndex]);

  return dates.some((date, index) => {
    if (getMonthKey(date) !== fixedMonthKey) return false;

    const slide = swiper.slides[index];
    if (!slide) return false;

    const slideRect = getSlideRect(slide);
    return isSlideVisible(slideRect, swiperRect);
  });
};

export const findFirstDayOfMonth = (
  firstDayIndices: number[],
  dates: Date[],
  monthKey: number,
): number | undefined => firstDayIndices.find(
  (firstDayIndex) => getMonthKey(dates[firstDayIndex]) === monthKey,
);

export const determineFixedMonth = (
  leftmostVisibleDay: { dayIndex: number; monthKey: number } | null,
  leftmostLastDay: { dayIndex: number; position: number; monthKey: number } | null,
  leftmostFirstDay: { dayIndex: number; position: number } | null,
  firstDayIndices: number[],
  dates: Date[],
  fixedMonthIndex: number | null,
  currentFixedMonthHasVisibleDays: boolean,
): { shouldFix: boolean; leftmostDayIndex: number | null } => {
  if (leftmostVisibleDay) {
    const firstDayOfLeftmostMonth = findFirstDayOfMonth(
      firstDayIndices,
      dates,
      leftmostVisibleDay.monthKey,
    );

    if (firstDayOfLeftmostMonth !== undefined) {
      return { shouldFix: true, leftmostDayIndex: firstDayOfLeftmostMonth };
    }
  }

  if (leftmostLastDay) {
    const isLastDayAtLeftEdge = leftmostLastDay.position <= 0;
    const firstDayPosition = leftmostFirstDay?.position ?? Infinity;
    const isLastDayLeftmost = !leftmostFirstDay || leftmostLastDay.position < firstDayPosition;

    if (isLastDayAtLeftEdge || isLastDayLeftmost) {
      const firstDayOfLastMonth = findFirstDayOfMonth(
        firstDayIndices,
        dates,
        leftmostLastDay.monthKey,
      );

      if (firstDayOfLastMonth !== undefined) {
        const isDifferentMonth = fixedMonthIndex === null
          || firstDayOfLastMonth !== fixedMonthIndex;
        if (isDifferentMonth && !currentFixedMonthHasVisibleDays) {
          return { shouldFix: true, leftmostDayIndex: firstDayOfLastMonth };
        }
      }
    }
  }

  return { shouldFix: false, leftmostDayIndex: null };
};

export const createMonthLabels = (
  firstDayIndices: number[],
  dates: Date[],
  swiperRect: DOMRect,
  dayRefs: RefObject<Map<number, HTMLButtonElement>>,
  swiper: SwiperType,
  newFixedIndex: number | null,
): MonthLabel[] => firstDayIndices.map((dayIndex) => {
  const firstDayDate = dates[dayIndex];
  const monthNameLabel = formatMonthShort(firstDayDate);
  const position = getElementPosition(dayIndex, swiperRect, dayRefs, swiper);
  const isFixed = dayIndex === newFixedIndex && newFixedIndex !== null;

  return {
    dayIndex,
    monthName: monthNameLabel,
    position: isFixed ? 0 : position,
    isFixed,
  };
});

export const shouldUnfixMonth = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  fixedMonthIndex: number,
): boolean => {
  const currentFixedSlide = swiper.slides[fixedMonthIndex];
  if (!currentFixedSlide) return false;

  const currentSlideEl = currentFixedSlide instanceof HTMLElement ? currentFixedSlide : null;
  if (!currentSlideEl) return false;

  const currentRect = currentSlideEl.getBoundingClientRect();
  const currentPosition = currentRect.left - swiperRect.left;

  return currentPosition > 0;
};
