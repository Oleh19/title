import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Swiper as SwiperType } from 'swiper';
import { getFirstDayIndices, getLastDayIndices } from '../lib/dateIndices';
import {
  findLeftmostVisibleDay,
  findLeftmostFirstDay,
  findLeftmostLastDay,
  hasFixedMonthVisibleDays,
  determineFixedMonth,
  createMonthLabels,
  shouldUnfixMonth,
  updateLabelPositions,
} from '../lib/monthLabelsUtils';
import UPDATE_DELAYS from '../lib/constants';

export type MonthLabel = {
  dayIndex: number;
  monthName: string;
  position: number;
  isFixed: boolean;
};

type UseMonthLabelsParams = {
  dates: Date[];
  dayRefs: React.RefObject<Map<number, HTMLButtonElement>>;
  swiperContainerRef: React.RefObject<HTMLDivElement | null>;
  swiperInstanceRef: React.RefObject<SwiperType | null>;
  monthLabelsWrapperRef: React.RefObject<HTMLDivElement | null>;
  monthLabelRefs: React.RefObject<Map<number, HTMLDivElement>>;
};

export const useMonthLabels = ({
  dates,
  dayRefs,
  swiperContainerRef,
  swiperInstanceRef,
  monthLabelsWrapperRef,
  monthLabelRefs,
}: UseMonthLabelsParams) => {
  const [monthLabels, setMonthLabels] = useState<MonthLabel[]>([]);
  const [fixedMonthIndex, setFixedMonthIndex] = useState<number | null>(null);
  const [fixedPosition, setFixedPosition] = useState<number | null>(null);

  const firstDayIndices = useMemo(() => getFirstDayIndices(dates), [dates]);
  const lastDayIndices = useMemo(() => getLastDayIndices(dates), [dates]);

  const updateMonthLabels = useCallback(() => {
    requestAnimationFrame(() => {
      const swiperContainer = swiperContainerRef.current;
      const swiper = swiperInstanceRef.current;

      if (!swiperContainer || !swiper) return;

      const visibleSlides = (swiper as any).visibleSlides || [];
      const swiperEl = swiper.el as HTMLElement;
      const swiperRect = swiperEl.getBoundingClientRect();
      const containerRect = swiperContainer.getBoundingClientRect();
      const swiperLeftOffset = swiperRect.left - containerRect.left;

      const leftmostVisibleDay = findLeftmostVisibleDay(swiper, swiperRect, dates);
      const leftmostFirstDay = findLeftmostFirstDay(
        swiper,
        swiperRect,
        visibleSlides,
        firstDayIndices,
      );
      const leftmostLastDay = findLeftmostLastDay(
        swiper,
        swiperRect,
        visibleSlides,
        lastDayIndices,
        dates,
      );
      const currentFixedMonthHasVisibleDays = hasFixedMonthVisibleDays(
        swiper,
        swiperRect,
        dates,
        fixedMonthIndex,
      );

      const { shouldFix, leftmostDayIndex } = determineFixedMonth(
        leftmostVisibleDay,
        leftmostLastDay,
        leftmostFirstDay,
        firstDayIndices,
        dates,
        fixedMonthIndex,
        currentFixedMonthHasVisibleDays,
      );

      const newFixedIndex = shouldFix && leftmostDayIndex !== null
        ? leftmostDayIndex
        : fixedMonthIndex;

      const newFixedPosition = shouldFix
        && leftmostDayIndex !== null
        && fixedMonthIndex !== leftmostDayIndex
        ? 0
        : fixedPosition;

      const labels = createMonthLabels(
        firstDayIndices,
        dates,
        swiperRect,
        dayRefs,
        swiper,
        newFixedIndex,
      );

      setMonthLabels(labels);

      const monthLabelsWrapper = monthLabelsWrapperRef.current;
      if (monthLabelsWrapper) {
        monthLabelsWrapper.style.left = `${swiperLeftOffset}px`;
        monthLabelsWrapper.style.width = `${swiperRect.width}px`;
      }

      if (shouldFix && leftmostDayIndex !== null) {
        setFixedMonthIndex(leftmostDayIndex);
        if (newFixedPosition !== null) {
          setFixedPosition(newFixedPosition);
        }
      } else if (!shouldFix && fixedMonthIndex !== null) {
        if (shouldUnfixMonth(swiper, swiperRect, fixedMonthIndex)) {
          setFixedMonthIndex(null);
          setFixedPosition(null);
        }
      }
    });
  }, [
    dates,
    firstDayIndices,
    fixedMonthIndex,
    fixedPosition,
    dayRefs,
    swiperContainerRef,
    swiperInstanceRef,
    monthLabelsWrapperRef,
  ]);

  useEffect(() => {
    updateMonthLabels();
    window.addEventListener('resize', updateMonthLabels);

    const timeouts = [
      UPDATE_DELAYS.INITIAL,
      UPDATE_DELAYS.SHORT,
      UPDATE_DELAYS.MEDIUM,
      UPDATE_DELAYS.LONG,
    ].map((delay) => setTimeout(updateMonthLabels, delay));

    return () => {
      window.removeEventListener('resize', updateMonthLabels);
      timeouts.forEach(clearTimeout);
    };
  }, [updateMonthLabels]);

  useEffect(() => {
    const updatePositions = () => {
      requestAnimationFrame(() => {
        const swiperContainer = swiperContainerRef.current;
        const swiper = swiperInstanceRef.current;

        if (!swiperContainer || !swiper) return;

        const swiperEl = swiper.el as HTMLElement;
        const swiperRect = swiperEl.getBoundingClientRect();

        updateLabelPositions(monthLabels, swiperRect, monthLabelRefs, dayRefs, swiper);
      });
    };

    updatePositions();
    const timeouts = [
      UPDATE_DELAYS.QUICK,
      UPDATE_DELAYS.FAST,
      UPDATE_DELAYS.MEDIUM,
    ].map((delay) => setTimeout(updatePositions, delay));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [monthLabels, dayRefs, monthLabelRefs, swiperContainerRef, swiperInstanceRef]);

  return {
    monthLabels,
    updateMonthLabels,
  };
};
