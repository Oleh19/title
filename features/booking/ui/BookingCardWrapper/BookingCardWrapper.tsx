'use client';

import React from 'react';
import { useBreakpoint } from '../../../../shared/hooks';
import BookingCard from '../BookingCard';
import BookingCardMobile from '../BookingCardMobile';

type BookingCardWrapperProps = {
  title: string;
  text: string;
  daysSlidesPerView: number | 'auto';
  daysSlidesPerGroup?: number;
  timeSlidesPerView: number | 'auto';
  timeSlidesPerGroup?: number;
  mobileDaysSlidesPerView?: number | 'auto';
  mobileDaysSlidesPerGroup?: number;
  mobileTimeSlidesPerView?: number | 'auto';
  mobileTimeSlidesPerGroup?: number;
};

function BookingCardWrapper({
  title,
  text,
  daysSlidesPerView,
  daysSlidesPerGroup,
  timeSlidesPerView,
  timeSlidesPerGroup,
  mobileDaysSlidesPerView,
  mobileDaysSlidesPerGroup,
  mobileTimeSlidesPerView,
  mobileTimeSlidesPerGroup,
}: BookingCardWrapperProps) {
  const isMobile = useBreakpoint('mobile', { defaultValue: false });

  if (isMobile) {
    return (
      <BookingCardMobile
        title={title}
        text={text}
        daysSlidesPerView={mobileDaysSlidesPerView ?? daysSlidesPerView}
        daysSlidesPerGroup={mobileDaysSlidesPerGroup ?? daysSlidesPerGroup}
        timeSlidesPerView={mobileTimeSlidesPerView ?? timeSlidesPerView}
        timeSlidesPerGroup={mobileTimeSlidesPerGroup ?? timeSlidesPerGroup}
      />
    );
  }

  return (
    <BookingCard
      title={title}
      text={text}
      daysSlidesPerView={daysSlidesPerView}
      daysSlidesPerGroup={daysSlidesPerGroup}
      timeSlidesPerView={timeSlidesPerView}
      timeSlidesPerGroup={timeSlidesPerGroup}
    />
  );
}

BookingCardWrapper.defaultProps = {
  daysSlidesPerGroup: undefined,
  timeSlidesPerGroup: undefined,
  mobileDaysSlidesPerView: undefined,
  mobileDaysSlidesPerGroup: undefined,
  mobileTimeSlidesPerView: undefined,
  mobileTimeSlidesPerGroup: undefined,
};

export default BookingCardWrapper;
