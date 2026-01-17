import React from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary';

type ButtonProps = {
  children: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  width?: string | number;
  onClick?: () => void;
};

function Button({
  children,
  disabled = false,
  variant = 'primary',
  width,
  onClick,
}: ButtonProps) {
  const variantClass = styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const widthStyle = width ? { width: typeof width === 'number' ? `${width}px` : width } : undefined;

  return (
    <button
      className={`${styles.button} ${variantClass}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={widthStyle}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  disabled: false,
  variant: 'primary',
  width: undefined,
  onClick: undefined,
};

export default Button;
