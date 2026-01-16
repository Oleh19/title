import React from 'react';
import BookingCard from '../widgets/BookingCard';
import styles from './page.module.scss';

function Home() {
  return (
    <main className={styles.page}>
      <BookingCard />
    </main>
  );
}

export default Home;
