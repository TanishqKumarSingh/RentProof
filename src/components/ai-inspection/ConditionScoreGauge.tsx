import React from 'react';
import { motion } from 'framer-motion';

interface ConditionScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  showRating?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#12B76A';
  if (score >= 60) return '#F79009';
  return '#F04438';
}

function getScoreRating(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  if (score >= 50) return 'Needs Attention';
  return 'Poor';
}

/**
 * Animated circular gauge showing property condition score (0–100).
 * Green ≥80, Orange 60–79, Red <60.
 */
export const ConditionScoreGauge: React.FC<ConditionScoreGaugeProps> = ({
  score,
  size = 160,
  label = 'Condition Score',
  showRating = true,
}) => {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const dashOffset = circumference * (1 - progress);
  const color = getScoreColor(score);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="#E4E7EC" strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <motion.circle
            cx={center} cy={center} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-black text-[#111827]"
            style={{ fontSize: size * 0.28 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {score}
          </motion.span>
          <span className="text-[#667085] font-medium" style={{ fontSize: size * 0.09 }}>
            / 100
          </span>
        </div>
      </div>
      <p className="text-xs text-[#667085] mt-2 font-medium">{label}</p>
      {showRating && (
        <span
          className="text-xs font-bold mt-1 px-3 py-0.5 rounded-full"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {getScoreRating(score)}
        </span>
      )}
    </div>
  );
};
