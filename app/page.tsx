import React from 'react';
import { BookingCardWrapper } from '../features/booking';
import styles from './page.module.scss';

function Home() {
  return (
    <>
      <main className={styles.page}>
        <BookingCardWrapper />
      </main>
    </>
  );
}

export default Home;
