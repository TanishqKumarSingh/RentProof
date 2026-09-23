import React from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import type { DamageComparison, ChangeType, FindingSeverity } from '../../types/inspection';
import { SEVERITY_CONFIG } from '../../types/inspection';

interface ComparisonCardProps {
  comparison: DamageComparison;
}

const CHANGE_CONFIG: Record<ChangeType, { label: string; bg: string; text: string; dot: string }> = {
  new_damage: { label: 'New Damage', bg: '#FEF3F2', text: '#B42318', dot: '#F04438' },
  worsened:   { label: 'Worsened', bg: '#FFFAEB', text: '#B54708', dot: '#F79009' },
  repaired:   { label: 'Repaired', bg: '#ECFDF3', text: '#027A48', dot: '#12B76A' },
  unchanged:  { label: 'Unchanged', bg: '#F2F4F7', text: '#344054', dot: '#667085' },
  existing:   { label: 'Existing (Unchanged)', bg: '#F2F4F7', text: '#344054', dot: '#667085' },
};

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ comparison }) => {
  const change = CHANGE_CONFIG[comparison.changeType];
  const sev = SEVERITY_CONFIG[comparison.severity];

  return (
    <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden">
      <div className="p-4 border-b border-[#E4E7EC] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#F7F8FA] text-[#667085] px-2 py-0.5 rounded border border-[#E4E7EC]">
            {comparison.roomName}
          </span>
          <span className="text-sm font-bold text-[#111827]">{comparison.findingType}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {comparison.changeType !== 'repaired' && comparison.changeType !== 'unchanged' && (
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full" 
              style={{ backgroundColor: sev.bg, color: sev.color }}
            >
              Severity: {sev.label}
            </span>
          )}
          <span 
            className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{ backgroundColor: change.bg, color: change.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: change.dot }} />
            {change.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E4E7EC]">
        {/* Move In */}
        <div className="p-4 bg-[#F7F8FA]/50">
          <h4 className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-2">Previously (Move-In)</h4>
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-gray-200 rounded-lg border border-[#E4E7EC] flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
              {comparison.moveInImageId ? 'Img' : 'No Img'}
            </div>
            <p className="text-xs text-[#344054] leading-relaxed flex-1">
              {comparison.moveInState}
            </p>
          </div>
        </div>

        {/* Move Out */}
        <div className="p-4">
          <h4 className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-2 flex items-center gap-1">
            Now (Move-Out)
          </h4>
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-gray-200 rounded-lg border border-[#E4E7EC] flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
              {comparison.moveOutImageId ? 'Img' : 'No Img'}
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#111827] font-medium leading-relaxed mb-1">
                {comparison.moveOutState}
              </p>
              {comparison.changeType === 'new_damage' && (
                <p className="text-[10px] text-[#B42318] flex items-center gap-1 mt-2 font-medium">
                  <AlertTriangle size={10} /> May require deposit review
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
