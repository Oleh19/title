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
};

function BookingCardWrapper({
  title,
  text,
  daysSlidesPerView,
  daysSlidesPerGroup,
  timeSlidesPerView,
  timeSlidesPerGroup,
}: BookingCardWrapperProps) {
  const isMobile = useBreakpoint('mobile', { defaultValue: false });

  if (isMobile) {
    return (
      <BookingCardMobile
        title={title}
        text={text}
        daysSlidesPerView={daysSlidesPerView}
        daysSlidesPerGroup={daysSlidesPerGroup}
        timeSlidesPerView={timeSlidesPerView}
        timeSlidesPerGroup={timeSlidesPerGroup}
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
};

export default BookingCardWrapper;
