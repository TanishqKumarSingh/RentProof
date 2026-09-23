import React from 'react';
import { Camera, AlertTriangle, Bed, Sofa, UtensilsCrossed, Bath, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import type { InspectionRoom } from '../../types/inspection';

interface RoomCardProps {
  room: InspectionRoom;
  onClick?: () => void;
  isActive?: boolean;
}

const getRoomIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('bed')) return Bed;
  if (n.includes('liv') || n.includes('hall')) return Sofa;
  if (n.includes('kit')) return UtensilsCrossed;
  if (n.includes('bath')) return Bath;
  return Camera; // default
};

export const RoomCard: React.FC<RoomCardProps> = ({ room, onClick, isActive }) => {
  const Icon = getRoomIcon(room.name);
  const isComplete = room.status === 'complete';
  const issueCount = room.findings.length;
  const imageCount = room.images.length;
  
  // Condition color logic
  const score = room.conditionScore;
  const scoreColor = score >= 80 ? '#12B76A' : score >= 60 ? '#F79009' : '#F04438';

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
        isActive ? 'border-[#3157FF] ring-1 ring-[#3157FF]' : 'border-[#E4E7EC]'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F7F8FA] flex items-center justify-center text-[#667085]">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827]">{room.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#667085] flex items-center gap-1">
                <Camera size={12} /> {imageCount}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#E4E7EC]" />
              <span className={`text-xs font-medium flex items-center gap-1 ${issueCount > 0 ? 'text-[#F04438]' : 'text-[#12B76A]'}`}>
                {issueCount > 0 ? <AlertTriangle size={12} /> : <Check size={12} />}
                {issueCount} issue{issueCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        {isComplete ? (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center gap-1">
              <CheckCircle2 size={10} /> Done
            </span>
            <span className="text-[10px] font-medium text-[#667085]">Score: {score}</span>
          </div>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F8FA] text-[#667085]">
            {room.status === 'capturing' ? 'Capturing...' : room.status === 'analyzing' ? 'Analyzing...' : 'Pending'}
          </span>
        )}
      </div>

      {/* Condition Bar (if complete) */}
      {isComplete && (
        <div className="mt-3">
          <div className="w-full h-1.5 bg-[#F7F8FA] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ width: `${score}%`, backgroundColor: scoreColor }} 
            />
          </div>
        </div>
      )}

      {onClick && (
        <div className="mt-3 pt-3 border-t border-[#F7F8FA] flex items-center justify-between text-[#3157FF]">
          <span className="text-xs font-semibold">View Details</span>
          <ChevronRight size={14} />
        </div>
      )}
    </div>
  );
};
