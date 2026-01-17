import type { Swiper as SwiperType } from 'swiper';
import type { RefObject } from 'react';

type SwiperWithVisibleSlides = SwiperType & { visibleSlides?: unknown[] };

const hasVisibleSlides = (swiper: SwiperType): swiper is SwiperWithVisibleSlides => (
  'visibleSlides' in swiper
);

export const getVisibleSlides = (swiper: SwiperType): unknown[] => {
  if (hasVisibleSlides(swiper) && Array.isArray(swiper.visibleSlides)) {
    return swiper.visibleSlides;
  }
  return [];
};

export const isSlideVisible = (
  slideRect: DOMRect,
  swiperRect: DOMRect,
): boolean => slideRect.left >= swiperRect.left && slideRect.left < swiperRect.right;

type VisibleSlide = { swiperSlideIndex: number } | HTMLElement;

const hasSwiperSlideIndex = (obj: unknown): obj is { swiperSlideIndex: number } => {
  if (typeof obj !== 'object' || obj === null) return false;
  if (!('swiperSlideIndex' in obj)) return false;
  const record = obj as Record<string, unknown>;
  const value = record.swiperSlideIndex;
  return typeof value === 'number';
};

const isVisibleSlide = (vs: unknown): vs is VisibleSlide => (
  vs instanceof HTMLElement || hasSwiperSlideIndex(vs)
);

const getSlideIndex = (slide: VisibleSlide): number | null => {
  if ('swiperSlideIndex' in slide && typeof slide.swiperSlideIndex === 'number') {
    return slide.swiperSlideIndex;
  }
  if (slide instanceof HTMLElement) {
    const attrValue = slide.getAttribute('data-swiper-slide-index');
    return attrValue !== null ? Number(attrValue) : null;
  }
  return null;
};

export const checkSlideVisibility = (
  dayIndex: number,
  slideRect: DOMRect,
  swiperRect: DOMRect,
  visibleSlides: unknown[],
): boolean => {
  const isInVisibleSlides = visibleSlides.some((vs: unknown) => {
    if (!isVisibleSlide(vs)) return false;
    const slideIndex = getSlideIndex(vs);
    return slideIndex !== null && slideIndex === dayIndex;
  });
  return isInVisibleSlides || isSlideVisible(slideRect, swiperRect);
};

const getSlidePosition = (slide: Element, swiperRect: DOMRect): number => {
  const slideEl = slide instanceof HTMLElement ? slide : null;
  if (!slideEl) return 0;
  const slideRect = slideEl.getBoundingClientRect();
  return slideRect.left - swiperRect.left;
};

export const getElementPosition = (
  dayIndex: number,
  swiperRect: DOMRect,
  dayRefs: RefObject<Map<number, HTMLButtonElement>>,
  swiper: SwiperType | null,
): number => {
  const dayElement = dayRefs.current?.get(dayIndex);
  if (dayElement) {
    const dayRect = dayElement.getBoundingClientRect();
    return dayRect.left - swiperRect.left;
  }

  if (!swiper) return 0;

  const slide = swiper.slides[dayIndex];
  return slide ? getSlidePosition(slide, swiperRect) : 0;
};
