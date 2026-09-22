import React from 'react';
import { clsx } from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={clsx(
        "inline-block rounded-full animate-spin border-solid border-t-transparent border-[#3157FF]",
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};
