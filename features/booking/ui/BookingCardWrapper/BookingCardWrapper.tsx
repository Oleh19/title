'use client';

import { useBreakpoint } from '../../../../shared/hooks';
import BookingCard from '../BookingCard';
import BookingCardMobile from '../BookingCardMobile';

function BookingCardWrapper() {
  const isMobile = useBreakpoint('mobile', { defaultValue: false });

  if (isMobile) {
    return <BookingCardMobile />;
  }

  return <BookingCard />;
}

export default BookingCardWrapper;
