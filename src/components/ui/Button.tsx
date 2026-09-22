import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

// Omit type from HTMLMotionProps as it conflicts with ButtonHTMLAttributes
type MotionButtonProps = Omit<HTMLMotionProps<"button">, "type"> & ButtonProps;

export const Button: React.FC<MotionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3157FF]";
  
  const variants = {
    primary: "bg-[#3157FF] text-white hover:bg-[#2545d4] shadow-sm border border-transparent",
    secondary: "bg-[#F7F8FA] text-[#111827] hover:bg-gray-100 border border-[#E4E7EC]",
    outline: "bg-transparent text-[#111827] hover:bg-gray-50 border border-[#E4E7EC]",
    ghost: "bg-transparent text-[#667085] hover:text-[#111827] hover:bg-gray-50 border border-transparent",
    danger: "bg-[#F04438] text-white hover:bg-[#d93a2e] shadow-sm border border-transparent",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2",
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-60 cursor-not-allowed",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="animate-spin w-4 h-4" />}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};
