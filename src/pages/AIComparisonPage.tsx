import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SplitSquareHorizontal, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { DEMO_MOVE_IN_INSPECTION, DEMO_MOVE_OUT_INSPECTION } from '../lib/demoInspectionData';
import { compareInspections } from '../services/inspectionAIService';
import { ComparisonCard } from '../components/ai-inspection/ComparisonCard';

export default function AIComparisonPage() {
  const navigate = useNavigate();

  // In a real app, these would be fetched based on agreement/property
  const moveIn = DEMO_MOVE_IN_INSPECTION;
  const moveOut = DEMO_MOVE_OUT_INSPECTION;

  const comparisons = useMemo(() => compareInspections(moveIn, moveOut), [moveIn, moveOut]);

  // Aggregate stats
  const stats = useMemo(() => {
    return {
      new_damage: comparisons.filter(c => c.changeType === 'new_damage').length,
      worsened: comparisons.filter(c => c.changeType === 'worsened').length,
      repaired: comparisons.filter(c => c.changeType === 'repaired').length,
      unchanged: comparisons.filter(c => c.changeType === 'unchanged' || c.changeType === 'existing').length,
    };
  }, [comparisons]);

  const hasNewDamage = stats.new_damage > 0 || stats.worsened > 0;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/ai-inspect')} className="w-10 h-10 rounded-full bg-white border border-[#E4E7EC] flex items-center justify-center text-[#111827] hover:bg-[#F7F8FA] transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
              <SplitSquareHorizontal size={24} className="text-[#3157FF]" />
              Inspection Comparison
            </h1>
            <p className="text-[#667085] mt-1">Move-In (Oct 2025) vs Move-Out (Sep 2026)</p>
          </div>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score comparison */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 flex flex-col justify-center shadow-sm">
          <h2 className="text-sm font-bold text-[#111827] mb-6">Condition Shift</h2>
          <div className="flex items-center justify-between px-4">
            <div className="text-center">
              <div className="text-4xl font-black text-[#12B76A] mb-1">{moveIn.overallScore}</div>
              <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Move-In Score</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#12B76A] via-[#F79009] to-[#F04438] mb-2" />
              <div className="text-xs font-bold text-[#F04438] bg-[#FEF3F2] px-2 py-0.5 rounded-full">
                -10 pts
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-black text-[#F79009] mb-1">{moveOut.overallScore}</div>
              <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Move-Out Score</div>
            </div>
          </div>
        </div>

        {/* Change Stats */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#111827] mb-4">Change Detection Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FEF3F2] border border-[#FECDCA] rounded-xl p-3">
              <div className="text-xs font-semibold text-[#B42318] mb-1">New Damage</div>
              <div className="text-2xl font-black text-[#B42318]">{stats.new_damage}</div>
            </div>
            <div className="bg-[#FFFAEB] border border-[#FEDF89] rounded-xl p-3">
              <div className="text-xs font-semibold text-[#B54708] mb-1">Worsened</div>
              <div className="text-2xl font-black text-[#B54708]">{stats.worsened}</div>
            </div>
            <div className="bg-[#ECFDF3] border border-[#A6F4C5] rounded-xl p-3">
              <div className="text-xs font-semibold text-[#027A48] mb-1">Repaired</div>
              <div className="text-2xl font-black text-[#027A48]">{stats.repaired}</div>
            </div>
            <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl p-3">
              <div className="text-xs font-semibold text-[#344054] mb-1">Unchanged</div>
              <div className="text-2xl font-black text-[#344054]">{stats.unchanged}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Warning (If new damage) */}
      {hasNewDamage && (
        <div className="bg-white border border-[#FECDCA] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#FEF3F2] flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-[#F04438]" />
          </div>
          <div>
            <h3 className="font-bold text-[#111827] text-sm">Potentially Relevant Damage Detected</h3>
            <p className="text-sm text-[#667085] mt-1 max-w-3xl leading-relaxed">
              AI has detected <strong>{stats.new_damage + stats.worsened}</strong> areas of new or worsened damage compared to the move-in inspection. 
              These findings may require review according to your rental agreement. RentProof provides this evidence for transparent discussion, but does not make legal or financial determinations regarding deposit deductions.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Comparisons List */}
      <div className="space-y-4 pt-4">
        <h3 className="font-bold text-[#111827] text-lg mb-2">Detailed Findings</h3>
        
        {/* Sort to show new damage first */}
        {comparisons
          .sort((a, b) => {
            const rank = { new_damage: 0, worsened: 1, repaired: 2, unchanged: 3, existing: 4 };
            return rank[a.changeType] - rank[b.changeType];
          })
          .map(cmp => (
            <ComparisonCard key={cmp.id} comparison={cmp} />
          ))}
      </div>
    </div>
  );
}
