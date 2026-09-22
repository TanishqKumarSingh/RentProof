import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

export interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'brand' | 'success' | 'warning' | 'danger';
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'brand',
}: MetricCardProps) {
  const colorStyles = {
    brand: 'border-l-[#3157FF] text-[#3157FF] bg-[#3157FF]/10',
    success: 'border-l-[#12B76A] text-[#12B76A] bg-[#12B76A]/10',
    warning: 'border-l-[#F79009] text-[#F79009] bg-[#F79009]/10',
    danger: 'border-l-[#F04438] text-[#F04438] bg-[#F04438]/10',
  };

  const trendStyles = {
    up: 'text-[#12B76A]',
    down: 'text-[#F04438]',
    neutral: 'text-[#667085]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'bg-white rounded-xl shadow-sm p-6 border-y border-r border-[#E4E7EC] border-l-4',
        colorStyles[color].split(' ')[0]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#667085]">{title}</p>
          <h3 className="text-2xl font-bold text-[#111827] mt-1">{value}</h3>
        </div>
        <div className={clsx('p-3 rounded-full', colorStyles[color].split(' ').slice(1).join(' '))}>
          <Icon size={20} />
        </div>
      </div>
      {(trend && trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          <span className={clsx('font-medium mr-2', trendStyles[trend])}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
          <span className="text-[#667085]">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
