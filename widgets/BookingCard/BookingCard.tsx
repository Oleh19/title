'use client';

import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Kaisei_Tokumin } from 'next/font/google';
import HorizontalSwiper from '../../shared/ui/HorizontalSwiper';
import generateDateRange from '../../shared/lib/dateUtils';
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

  // Знаходимо індекси перших днів кожного місяця
  const firstDayIndices = useMemo(() => {
    const indices: number[] = [];
    dates.forEach((date, index) => {
      if (index === 0) {
        indices.push(index);
      } else {
        const prevDate = dates[index - 1];
        if (
          date.getMonth() !== prevDate.getMonth()
          || date.getFullYear() !== prevDate.getFullYear()
        ) {
          indices.push(index);
        }
      }
    });
    return indices;
  }, [dates]);

  // Знаходимо індекси останніх днів кожного місяця
  const lastDayIndices = useMemo(() => {
    const indices: number[] = [];
    dates.forEach((date, index) => {
      if (index === dates.length - 1) {
        indices.push(index);
      } else {
        const nextDate = dates[index + 1];
        if (
          date.getMonth() !== nextDate.getMonth()
          || date.getFullYear() !== nextDate.getFullYear()
        ) {
          indices.push(index);
        }
      }
    });
    return indices;
  }, [dates]);

  const monthLabelRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<any>(null);
  const monthLabelsWrapperRef = useRef<HTMLDivElement>(null);
  const [monthLabels, setMonthLabels] = useState<
  Array<{ dayIndex: number; monthName: string; position: number; isFixed: boolean }>
  >([]);
  const [fixedMonthIndex, setFixedMonthIndex] = useState<number | null>(null);
  const [fixedPosition, setFixedPosition] = useState<number | null>(null);

  // Оновлюємо позиції міток місяців
  const updateMonthLabels = React.useCallback(() => {
    requestAnimationFrame(() => {
      if (!swiperContainerRef.current || !swiperInstanceRef.current) return;

      const swiper = swiperInstanceRef.current;
      const labels: Array<{
        dayIndex: number;
        monthName: string;
        position: number;
        isFixed: boolean;
      }> = [];

      // Використовуємо Swiper API для визначення видимих слайдів
      const visibleSlides = (swiper as any).visibleSlides || [];
      const swiperEl = swiper.el as HTMLElement;
      const swiperRect = swiperEl.getBoundingClientRect();
      const containerRect = swiperContainerRef.current.getBoundingClientRect();

      // Знаходимо позицію лівого краю свайпера відносно контейнера
      const swiperLeftOffset = swiperRect.left - containerRect.left;

      // Знаходимо крайній лівий видимий елемент (будь-який день) для визначення місяця
      let leftmostVisibleDay: { dayIndex: number; monthKey: number } | null = null;
      let leftmostPosition = Infinity;
      for (let i = 0; i < dates.length; i++) {
        const slide = swiper.slides[i];
        if (slide) {
          const slideEl = slide as HTMLElement;
          const slideRect = slideEl.getBoundingClientRect();
          const position = slideRect.left - swiperRect.left;

          // Перевіряємо, чи слайд видимий
          const isVisible = slideRect.left >= swiperRect.left && slideRect.left < swiperRect.right;

          if (isVisible && position < leftmostPosition) {
            leftmostPosition = position;
            const date = dates[i];
            leftmostVisibleDay = {
              dayIndex: i,
              monthKey: date.getFullYear() * 12 + date.getMonth(),
            };
          }
        }
      }

      // Знаходимо найлівіший видимий перший день місяця
      let leftmostFirstDay: { dayIndex: number; position: number } | null = null;

      firstDayIndices.forEach((dayIndex) => {
        const slide = swiper.slides[dayIndex];
        if (slide) {
          const slideEl = slide as HTMLElement;
          const slideRect = slideEl.getBoundingClientRect();
          const position = slideRect.left - swiperRect.left;

          // Перевіряємо, чи слайд видимий
          const isVisible = visibleSlides.some((vs: any) => {
            const vsIndex = vs.swiperSlideIndex !== undefined
              ? vs.swiperSlideIndex
              : (vs as HTMLElement).getAttribute('data-swiper-slide-index');
            return Number(vsIndex) === dayIndex;
          }) || (slideRect.left >= swiperRect.left && slideRect.left < swiperRect.right);

          if (isVisible) {
            if (!leftmostFirstDay || position < leftmostFirstDay.position) {
              leftmostFirstDay = { dayIndex, position };
            }
          }
        }
      });

      // Знаходимо найлівіший видимий останній день місяця
      let leftmostLastDay: { dayIndex: number; position: number; monthKey: number } | null = null;

      lastDayIndices.forEach((dayIndex) => {
        const slide = swiper.slides[dayIndex];
        if (slide) {
          const slideEl = slide as HTMLElement;
          const slideRect = slideEl.getBoundingClientRect();
          const position = slideRect.left - swiperRect.left;

          // Перевіряємо, чи слайд видимий
          const isVisible = visibleSlides.some((vs: any) => {
            const vsIndex = vs.swiperSlideIndex !== undefined
              ? vs.swiperSlideIndex
              : (vs as HTMLElement).getAttribute('data-swiper-slide-index');
            return Number(vsIndex) === dayIndex;
          }) || (slideRect.left >= swiperRect.left && slideRect.left < swiperRect.right);

          if (isVisible) {
            const date = dates[dayIndex];
            const monthKey = date.getFullYear() * 12 + date.getMonth();
            if (!leftmostLastDay || position < leftmostLastDay.position) {
              leftmostLastDay = { dayIndex, position, monthKey };
            }
          }
        }
      });

      // Перевіряємо, чи є дні поточного фіксованого місяця в видимій області
      let currentFixedMonthHasVisibleDays = false;
      if (fixedMonthIndex !== null) {
        const fixedMonthDate = dates[fixedMonthIndex];
        const fixedMonthKey = fixedMonthDate.getFullYear() * 12 + fixedMonthDate.getMonth();

        // Перевіряємо всі дні в видимій області
        for (let i = 0; i < dates.length; i++) {
          const date = dates[i];
          const monthKey = date.getFullYear() * 12 + date.getMonth();

          if (monthKey === fixedMonthKey) {
            const slide = swiper.slides[i];
            if (slide) {
              const slideEl = slide as HTMLElement;
              const slideRect = slideEl.getBoundingClientRect();
              // Перевіряємо, чи слайд видимий
              const isVisible = slideRect.left >= swiperRect.left && slideRect.left < swiperRect.right;
              if (isVisible) {
                currentFixedMonthHasVisibleDays = true;
                break;
              }
            }
          }
        }
      }

      // Визначаємо, який місяць має бути фіксованим
      // Фіксований місяць завжди відповідає місяцю крайнього лівого елемента
      let shouldFix = false;
      let leftmostDayIndex: number | null = null;

      // Знаходимо перший день місяця крайнього лівого видимого елемента
      if (leftmostVisibleDay) {
        const firstDayOfLeftmostMonth = firstDayIndices.find((firstDayIndex) => {
          const firstDayDate = dates[firstDayIndex];
          const firstDayMonthKey = firstDayDate.getFullYear() * 12 + firstDayDate.getMonth();
          return firstDayMonthKey === leftmostVisibleDay.monthKey;
        });

        if (firstDayOfLeftmostMonth !== undefined) {
          shouldFix = true;
          leftmostDayIndex = firstDayOfLeftmostMonth;
        }
      }

      // Якщо найлівіший видимий останній день місяця є найлівішим елементом,
      // перевіряємо, чи це інший місяць, ніж поточний фіксований
      // Це важливо для slidesPerGroup > 1, коли останній день може не досягти позиції 0
      if (leftmostLastDay) {
        const lastDay = leftmostLastDay as { dayIndex: number; position: number; monthKey: number };
        // Перевіряємо, чи останній день досяг лівої позиції або є найлівішим видимим
        const isLastDayAtLeftEdge = lastDay.position <= 0;
        const firstDayPosition = leftmostFirstDay
          ? (leftmostFirstDay as { dayIndex: number; position: number }).position
          : Infinity;
        const isLastDayLeftmost = leftmostFirstDay === null
          || lastDay.position < firstDayPosition;

        if (isLastDayAtLeftEdge || isLastDayLeftmost) {
          const lastDayMonthKey = lastDay.monthKey;

          // Знаходимо індекс першого дня цього місяця
          const firstDayOfLastMonth = firstDayIndices.find((firstDayIndex) => {
            const firstDayDate = dates[firstDayIndex];
            const firstDayMonthKey = firstDayDate.getFullYear() * 12 + firstDayDate.getMonth();
            return firstDayMonthKey === lastDayMonthKey;
          });

          if (firstDayOfLastMonth !== undefined) {
            // Якщо це інший місяць, ніж поточний фіксований, він стає новим фіксованим
            // Але тільки якщо поточний фіксований місяць не має видимих днів
            if ((fixedMonthIndex === null || firstDayOfLastMonth !== fixedMonthIndex)
              && !currentFixedMonthHasVisibleDays) {
              shouldFix = true;
              leftmostDayIndex = firstDayOfLastMonth;
            }
          }
        }
      }

      // Якщо найлівіший перший день досяг лівої позиції або останній день попереднього місяця,
      // він стає новим фіксованим
      const newFixedIndex = shouldFix && leftmostDayIndex !== null
        ? leftmostDayIndex
        : fixedMonthIndex;

      // Зберігаємо позицію при фіксації нового місяця (відносно обгортки)
      let newFixedPosition = fixedPosition;
      if (shouldFix && leftmostDayIndex !== null) {
        // Якщо це новий фіксований місяць (не той самий, що був раніше)
        if (fixedMonthIndex !== leftmostDayIndex) {
          // Позиція 0 відносно обгортки (лівий край свайпера)
          newFixedPosition = 0;
        }
      }

      // Проходимо по всіх перших днях місяців
      firstDayIndices.forEach((dayIndex) => {
        const firstDayDate = dates[dayIndex];
        const monthNameLabel = new Intl.DateTimeFormat('en-US', {
          month: 'short',
        }).format(firstDayDate);

        // Спробуємо отримати позицію зі слайда або з dayRefs
        let position = 0;

        // Спочатку перевіряємо dayRefs (більш надійно)
        const dayElement = dayRefs.current.get(dayIndex);
        if (dayElement) {
          const dayRect = dayElement.getBoundingClientRect();
          // Позиція відносно обгортки (swiperLeftOffset)
          position = dayRect.left - swiperRect.left;
        } else {
          // Якщо немає в dayRefs, спробуємо отримати зі слайда
          const slide = swiper.slides[dayIndex];
          if (slide) {
            const slideEl = slide as HTMLElement;
            const slideRect = slideEl.getBoundingClientRect();
            // Позиція відносно обгортки (swiperLeftOffset)
            position = slideRect.left - swiperRect.left;
          }
        }

        // Додаємо мітку завжди, навіть якщо елемент ще не відрендерений
        const isFixed = dayIndex === newFixedIndex && newFixedIndex !== null;

        // Позиція для фіксованої мітки - 0 відносно обгортки (лівий край свайпера)
        const finalPosition = isFixed ? 0 : position;

        labels.push({
          dayIndex,
          monthName: monthNameLabel,
          position: finalPosition,
          isFixed: isFixed || false,
        });
      });

      setMonthLabels(labels);

      // Оновлюємо позицію та ширину обгортки міток для обмеження видимості
      if (monthLabelsWrapperRef.current) {
        monthLabelsWrapperRef.current.style.left = `${swiperLeftOffset}px`;
        monthLabelsWrapperRef.current.style.width = `${swiperRect.width}px`;
      }

      if (shouldFix && leftmostDayIndex !== null) {
        setFixedMonthIndex(leftmostDayIndex);
        if (newFixedPosition !== null) {
          setFixedPosition(newFixedPosition);
        }
      } else if (!shouldFix && fixedMonthIndex !== null) {
        // Якщо поточний фіксований місяць більше не досяг лівої позиції, знімаємо фіксацію
        const currentFixedSlide = swiper.slides[fixedMonthIndex];
        if (currentFixedSlide) {
          const currentSlideEl = currentFixedSlide as HTMLElement;
          const currentRect = currentSlideEl.getBoundingClientRect();
          const currentPosition = currentRect.left - swiperRect.left;
          // Якщо елемент знову рухається вправо (позиція > 0), знімаємо фіксацію
          if (currentPosition > 0) {
            setFixedMonthIndex(null);
            setFixedPosition(null);
          }
        }
      }
    });
  }, [dates, firstDayIndices, fixedMonthIndex, fixedPosition]);

  useEffect(() => {
    updateMonthLabels();
    window.addEventListener('resize', updateMonthLabels);

    // Оновлюємо після затримки для коректного рендерингу Swiper
    const timeoutId1 = setTimeout(updateMonthLabels, 100);
    const timeoutId2 = setTimeout(updateMonthLabels, 300);
    const timeoutId3 = setTimeout(updateMonthLabels, 500);
    const timeoutId4 = setTimeout(updateMonthLabels, 1000);

    return () => {
      window.removeEventListener('resize', updateMonthLabels);
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
    };
  }, [updateMonthLabels]);

  // Оновлюємо позиції міток після рендеру елементів
  useEffect(() => {
    const updatePositions = () => {
      requestAnimationFrame(() => {
        if (!swiperContainerRef.current || !swiperInstanceRef.current) return;

        const swiper = swiperInstanceRef.current;
        const swiperEl = swiper.el as HTMLElement;
        const swiperRect = swiperEl.getBoundingClientRect();

        monthLabels.forEach(({ dayIndex, isFixed }) => {
          if (isFixed) return; // Не оновлюємо фіксовані мітки

          const labelElement = monthLabelRefs.current.get(dayIndex);
          if (!labelElement) return;

          // Спробуємо отримати позицію з dayRefs або слайда
          const dayElement = dayRefs.current.get(dayIndex);
          if (dayElement) {
            const dayRect = dayElement.getBoundingClientRect();
            const position = dayRect.left - swiperRect.left;
            labelElement.style.left = `${position}px`;
          } else {
            const slide = swiper.slides[dayIndex];
            if (slide) {
              const slideEl = slide as HTMLElement;
              const slideRect = slideEl.getBoundingClientRect();
              const position = slideRect.left - swiperRect.left;
              labelElement.style.left = `${position}px`;
            }
          }
        });
      });
    };

    updatePositions();
    const timeoutId1 = setTimeout(updatePositions, 50);
    const timeoutId2 = setTimeout(updatePositions, 200);
    const timeoutId3 = setTimeout(updatePositions, 500);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [monthLabels]);

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
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                    }).format(date)}
                  </span>
                  <span className={styles.dayDate}>
                    {new Intl.DateTimeFormat('en-US', {
                      day: '2-digit',
                    }).format(date)}
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
