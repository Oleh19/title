import type { Swiper as SwiperType } from 'swiper';
import type { RefObject } from 'react';
import { getMonthKey, formatMonthShort } from './dateUtils';
import { isSlideVisible, checkSlideVisibility, getElementPosition } from './swiperUtils';
import type { MonthLabel } from '../hooks/useMonthLabels';

const getSlideRect = (slide: Element): DOMRect => {
  const slideEl = slide as HTMLElement;
  return slideEl.getBoundingClientRect();
};

export const findLeftmostVisibleDay = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  dates: Date[],
): { dayIndex: number; monthKey: number } | null => {
  let leftmost: { dayIndex: number; monthKey: number } | null = null;
  let leftmostPosition = Infinity;

  for (let i = 0; i < dates.length; i += 1) {
    const slide = swiper.slides[i];
    if (slide) {
      const slideRect = getSlideRect(slide);
      const position = slideRect.left - swiperRect.left;

      if (isSlideVisible(slideRect, swiperRect) && position < leftmostPosition) {
        leftmostPosition = position;
        leftmost = {
          dayIndex: i,
          monthKey: getMonthKey(dates[i]),
        };
      }
    }
  }

  return leftmost;
};

export const findLeftmostFirstDay = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  visibleSlides: any[],
  firstDayIndices: number[],
): { dayIndex: number; position: number } | null => {
  let leftmost: { dayIndex: number; position: number } | null = null;

  firstDayIndices.forEach((dayIndex) => {
    const slide = swiper.slides[dayIndex];
    if (slide) {
      const slideRect = getSlideRect(slide);
      const position = slideRect.left - swiperRect.left;

      if (checkSlideVisibility(dayIndex, slideRect, swiperRect, visibleSlides)) {
        if (!leftmost || position < leftmost.position) {
          leftmost = { dayIndex, position };
        }
      }
    }
  });

  return leftmost;
};

export const findLeftmostLastDay = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  visibleSlides: any[],
  lastDayIndices: number[],
  dates: Date[],
): { dayIndex: number; position: number; monthKey: number } | null => {
  let leftmost: { dayIndex: number; position: number; monthKey: number } | null = null;

  lastDayIndices.forEach((dayIndex) => {
    const slide = swiper.slides[dayIndex];
    if (slide) {
      const slideRect = getSlideRect(slide);
      const position = slideRect.left - swiperRect.left;

      if (checkSlideVisibility(dayIndex, slideRect, swiperRect, visibleSlides)) {
        const monthKey = getMonthKey(dates[dayIndex]);
        if (!leftmost || position < leftmost.position) {
          leftmost = { dayIndex, position, monthKey };
        }
      }
    }
  });

  return leftmost;
};

export const hasFixedMonthVisibleDays = (
  swiper: SwiperType,
  swiperRect: DOMRect,
  dates: Date[],
  fixedMonthIndex: number | null,
): boolean => {
  if (fixedMonthIndex === null) return false;

  const fixedMonthKey = getMonthKey(dates[fixedMonthIndex]);

  for (let i = 0; i < dates.length; i += 1) {
    if (getMonthKey(dates[i]) === fixedMonthKey) {
      const slide = swiper.slides[i];
      if (slide) {
        const slideRect = getSlideRect(slide);
        if (isSlideVisible(slideRect, swiperRect)) {
          return true;
        }
      }
    }
  }

  return false;
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
  let shouldFix = false;
  let leftmostDayIndex: number | null = null;

  if (leftmostVisibleDay) {
    const firstDayOfLeftmostMonth = findFirstDayOfMonth(
      firstDayIndices,
      dates,
      leftmostVisibleDay.monthKey,
    );

    if (firstDayOfLeftmostMonth !== undefined) {
      shouldFix = true;
      leftmostDayIndex = firstDayOfLeftmostMonth;
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
          shouldFix = true;
          leftmostDayIndex = firstDayOfLastMonth;
        }
      }
    }
  }

  return { shouldFix, leftmostDayIndex };
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

  const currentSlideEl = currentFixedSlide as HTMLElement;
  const currentRect = currentSlideEl.getBoundingClientRect();
  const currentPosition = currentRect.left - swiperRect.left;

  return currentPosition > 0;
};

export const updateLabelPositions = (
  monthLabels: MonthLabel[],
  swiperRect: DOMRect,
  monthLabelRefs: RefObject<Map<number, HTMLDivElement>>,
  dayRefs: RefObject<Map<number, HTMLButtonElement>>,
  swiper: SwiperType,
): void => {
  monthLabels.forEach((label) => {
    const labelElement = monthLabelRefs.current?.get(label.dayIndex);
    if (labelElement) {
      const position = label.isFixed
        ? 0
        : getElementPosition(label.dayIndex, swiperRect, dayRefs, swiper);
      labelElement.style.left = `${position}px`;
    }
  });
};
