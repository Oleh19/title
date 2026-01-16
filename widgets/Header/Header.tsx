import React from 'react';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.siteHeader}>
      <span className={styles.siteHeaderTitle}>
        6037 Venture Partnership
      </span>
    </header>
  );
}

export default Header;
