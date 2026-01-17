import React from 'react';
import { BookingCardWrapper } from '../features/booking';
import styles from './page.module.scss';

function Home() {
  return (
    <main className={styles.page}>
      <BookingCardWrapper
        title="Book a Session"
        text="Choose a date and time that is convenient for you to e-meet your stylist"
        daysSlidesPerView={6}
        daysSlidesPerGroup={1}
        timeSlidesPerView={5}
        timeSlidesPerGroup={1}
        mobileDaysSlidesPerView={5}
        mobileDaysSlidesPerGroup={1}
        mobileTimeSlidesPerView={4}
        mobileTimeSlidesPerGroup={1}
      />
    </main>
  );
}

export default Home;
