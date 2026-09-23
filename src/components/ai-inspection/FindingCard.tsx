import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, AlertTriangle, Info } from 'lucide-react';
import { SEVERITY_CONFIG, CATEGORY_LABELS } from '../../types/inspection';
import type { AIFinding } from '../../types/inspection';

interface FindingCardProps {
  finding: AIFinding;
  index: number;
  onViewImage?: (finding: AIFinding) => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, index, onViewImage }) => {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[finding.severity];
  const confidencePct = Math.round(finding.confidence * 100);

  return (
    <div
      className="bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor: sev.border }}
    >
      {/* Severity bar */}
      <div className="h-1" style={{ backgroundColor: sev.color }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
              style={{ backgroundColor: sev.color }}
            >
              #{String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#111827] truncate">{finding.type}</h4>
              <p className="text-xs text-[#667085] mt-0.5">{finding.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: sev.color, backgroundColor: sev.bg }}
            >
              {sev.label}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-[#667085] hover:text-[#111827] rounded"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Category + confidence */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] bg-[#F7F8FA] text-[#667085] px-2 py-0.5 rounded-full border border-[#E4E7EC]">
            {CATEGORY_LABELS[finding.category]}
          </span>
          <div className="flex items-center gap-1.5 flex-1">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${confidencePct}%`, backgroundColor: confidencePct > 85 ? '#12B76A' : confidencePct > 70 ? '#F79009' : '#F04438' }}
              />
            </div>
            <span className="text-[10px] text-[#667085] font-medium">{confidencePct}%</span>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-[#E4E7EC] space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#111827] mb-1 flex items-center gap-1">
                <Info size={12} /> Description
              </p>
              <p className="text-xs text-[#667085] leading-relaxed">{finding.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111827] mb-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Recommendation
              </p>
              <p className="text-xs text-[#667085] leading-relaxed">{finding.recommendation}</p>
            </div>
            {finding.confidence < 0.8 && (
              <p className="text-[10px] text-[#F79009] bg-[#FFFAEB] p-2 rounded-lg border border-[#FEDF89] italic">
                ⚠️ Confidence below 80%. Image quality may be insufficient for a reliable assessment.
              </p>
            )}
            {onViewImage && (
              <button
                onClick={() => onViewImage(finding)}
                className="flex items-center gap-1.5 text-xs text-[#3157FF] font-medium hover:underline"
              >
                <Eye size={14} /> View on Image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
