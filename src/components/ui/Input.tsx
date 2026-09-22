import React, { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, required, disabled, id, ...props }, ref) => {
    const generatedId = id || React.useId();

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label htmlFor={generatedId} className="block text-sm font-medium text-[#111827] mb-1.5">
            {label}
            {required && <span className="text-[#F04438] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={generatedId}
            disabled={disabled}
            className={clsx(
              "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors",
              icon ? "pl-10" : "",
              error
                ? "border-[#F04438] focus:border-[#F04438] focus:ring-[#FEF3F2]"
                : "border-[#E4E7EC] focus:border-[#3157FF] focus:ring-[#EFF4FF]",
              disabled && "bg-gray-50 text-gray-500 cursor-not-allowed"
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[#F04438]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
