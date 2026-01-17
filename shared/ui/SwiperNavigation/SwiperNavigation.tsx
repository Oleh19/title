import React from 'react';
import SwiperNavButton from './SwiperNavButton';

type SwiperNavigationProps = {
  onPrev: () => void;
  onNext: () => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  className?: string;
};

function SwiperNavigation({
  onPrev,
  onNext,
  canScrollLeft,
  canScrollRight,
  className,
}: SwiperNavigationProps) {
  return (
    <>
      <SwiperNavButton
        direction="prev"
        onClick={onPrev}
        disabled={!canScrollLeft}
        className={className}
      />
      <SwiperNavButton
        direction="next"
        onClick={onNext}
        disabled={!canScrollRight}
        className={className}
      />
    </>
  );
}

SwiperNavigation.defaultProps = {
  className: undefined,
};

export default SwiperNavigation;
