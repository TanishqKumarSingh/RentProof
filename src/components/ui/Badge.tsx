import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className,
  dot = false,
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full uppercase whitespace-nowrap";
  
  const variants = {
    success: "bg-[#ECFDF3] text-[#12B76A]",
    warning: "bg-[#FFFAEB] text-[#F79009]",
    danger: "bg-[#FEF3F2] text-[#F04438]",
    info: "bg-[#EFF4FF] text-[#3157FF]",
    neutral: "bg-gray-100 text-gray-600",
  };

  const dotColors = {
    success: "bg-[#12B76A]",
    warning: "bg-[#F79009]",
    danger: "bg-[#F04438]",
    info: "bg-[#3157FF]",
    neutral: "bg-gray-400",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {dot && (
        <span className={clsx("rounded-full flex-shrink-0", dotColors[variant], dotSizes[size])} />
      )}
      {children}
    </span>
  );
};
