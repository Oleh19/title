// eslint-disable-next-line import/no-extraneous-dependencies
import type { Swiper as SwiperType } from 'swiper';

/**
 * Проверяет, видим ли слайд в области свайпера
 */
export const isSlideVisible = (
  slideRect: DOMRect,
  swiperRect: DOMRect,
): boolean => slideRect.left >= swiperRect.left && slideRect.left < swiperRect.right;

/**
 * Проверяет видимость слайда через visibleSlides или позицию
 */
export const checkSlideVisibility = (
  dayIndex: number,
  slideRect: DOMRect,
  swiperRect: DOMRect,
  visibleSlides: any[],
): boolean => {
  const isInVisibleSlides = visibleSlides.some((vs: any) => {
    const vsIndex = vs.swiperSlideIndex !== undefined
      ? vs.swiperSlideIndex
      : (vs as HTMLElement).getAttribute('data-swiper-slide-index');
    return Number(vsIndex) === dayIndex;
  });
  return isInVisibleSlides || isSlideVisible(slideRect, swiperRect);
};

/**
 * Получает позицию элемента относительно свайпера
 */
export const getElementPosition = (
  dayIndex: number,
  swiperRect: DOMRect,
  dayRefs: React.RefObject<Map<number, HTMLButtonElement>>,
  swiper: SwiperType | null,
): number => {
  const dayElement = dayRefs.current?.get(dayIndex);
  if (dayElement) {
    const dayRect = dayElement.getBoundingClientRect();
    return dayRect.left - swiperRect.left;
  }

  if (!swiper) return 0;

  const slide = swiper.slides[dayIndex];
  if (slide) {
    const slideEl = slide as HTMLElement;
    const slideRect = slideEl.getBoundingClientRect();
    return slideRect.left - swiperRect.left;
  }

  return 0;
};
