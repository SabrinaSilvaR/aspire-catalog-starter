import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) => {
  const inputId = id || props.name;

  return (
    <div className={styles.wrapper}>
      {label && inputId ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.hasError : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error ? <span className={styles.errorMessage}>{error}</span> : null}
    </div>
  );
};
