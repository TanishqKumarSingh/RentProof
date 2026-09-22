import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from '../ui/CircularProgress';

export interface RentalHealthScoreProps {
  score: number;
  breakdown: {
    payment: number;
    maintenance: number;
    documentation: number;
  };
}

export function RentalHealthScore({ score, breakdown }: RentalHealthScoreProps) {
  const getColor = (val: number) => {
    if (val >= 80) return '#12B76A'; // Success
    if (val >= 60) return '#F79009'; // Warning
    return '#F04438'; // Danger
  };

  const getLabel = (val: number) => {
    if (val >= 80) return 'Excellent';
    if (val >= 60) return 'Good';
    return 'Needs Attention';
  };

  const mainColor = getColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-[#E4E7EC] flex flex-col items-center"
    >
      <h3 className="text-lg font-semibold text-[#111827] mb-6 self-start">Rental Health</h3>
      
      <div className="relative mb-8">
        <CircularProgress value={score} size={160} strokeWidth={12} color={mainColor} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-[#111827]">{score}</span>
          <span className="text-sm font-medium" style={{ color: mainColor }}>{getLabel(score)}</span>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#667085]">Payments</span>
          <div className="w-32 h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${breakdown.payment}%`, backgroundColor: getColor(breakdown.payment) }} />
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#667085]">Maintenance</span>
          <div className="w-32 h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${breakdown.maintenance}%`, backgroundColor: getColor(breakdown.maintenance) }} />
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#667085]">Documentation</span>
          <div className="w-32 h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${breakdown.documentation}%`, backgroundColor: getColor(breakdown.documentation) }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
