import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={clsx("flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl bg-[#F7F8FA] border border-dashed border-[#E4E7EC]", className)}>
      <div className="bg-white p-3 rounded-full shadow-sm mb-4 border border-[#E4E7EC] text-[#3157FF]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#111827] mb-1">{title}</h3>
      <p className="text-sm text-[#667085] max-w-sm mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
