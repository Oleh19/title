import React from 'react';
import { ArrowLeft, ArrowRight } from '../icons';
import styles from './SwiperNavButton.module.scss';

type SwiperNavButtonProps = {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
  className?: string;
};

function SwiperNavButton({
  direction,
  onClick,
  disabled,
  className,
}: SwiperNavButtonProps) {
  const isPrev = direction === 'prev';
  const ariaLabel = isPrev ? 'Scroll left' : 'Scroll right';

  return (
    <button
      className={`${styles.button} ${className || ''}`}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {isPrev ? <ArrowLeft /> : <ArrowRight />}
    </button>
  );
}

SwiperNavButton.defaultProps = {
  className: undefined,
};

export default SwiperNavButton;
