import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, History, Camera, Plus, BarChart2, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ConditionScoreGauge } from '../components/ai-inspection/ConditionScoreGauge';
import { RoomCard } from '../components/ai-inspection/RoomCard';
import { DEMO_MOVE_IN_INSPECTION, DEMO_MOVE_OUT_INSPECTION } from '../lib/demoInspectionData';
import { isVisionAPIAvailable } from '../services/inspectionAIService';

export default function AIInspectionPage() {
  const navigate = useNavigate();
  const { isDemoMode } = useAuth();
  
  // In demo mode, we show the move-out inspection as the "latest" one for the dashboard
  const latestInspection = isDemoMode ? DEMO_MOVE_OUT_INSPECTION : DEMO_MOVE_IN_INSPECTION;
  const isRealAI = isVisionAPIAvailable();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Header & Main CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] text-white p-6 rounded-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3157FF] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-[#3157FF]" />
            <h1 className="text-2xl font-bold">AI Property Inspection</h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Scan your property with your camera. Our AI will automatically detect visible damage, 
            generate a condition score, and document a verifiable proof record.
          </p>
          
          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={() => navigate('/ai-inspect/new')}
              className="bg-[#3157FF] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-[#3157FF]/20"
            >
              <Camera size={16} /> Start New Inspection
            </button>
            <button 
              onClick={() => navigate('/ai-inspect/compare')}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
            >
              <BarChart2 size={16} /> Compare Move-In vs Move-Out
            </button>
          </div>
        </div>
        
        {!isRealAI && (
          <div className="relative z-10 self-start md:self-center bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-gray-300 max-w-xs">
            <span className="text-[#F79009] font-bold block mb-1">Demo Mode Active</span>
            Vision API not configured. Using mock analysis engine with simulated findings.
          </div>
        )}
      </div>

      {/* Latest Inspection Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-[#E4E7EC] p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <h2 className="text-sm font-bold text-[#111827] absolute top-6 left-6">Current Condition</h2>
          <div className="mt-8 mb-4">
            <ConditionScoreGauge score={latestInspection.overallScore} size={180} />
          </div>
          <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center border-t border-[#F7F8FA] pt-4">
            <div>
              <div className="text-lg font-black text-[#F04438]">{latestInspection.summary.highPriority}</div>
              <div className="text-[10px] text-[#667085] font-semibold uppercase">High</div>
            </div>
            <div className="border-x border-[#F7F8FA]">
              <div className="text-lg font-black text-[#F79009]">{latestInspection.summary.mediumPriority}</div>
              <div className="text-[10px] text-[#667085] font-semibold uppercase">Med</div>
            </div>
            <div>
              <div className="text-lg font-black text-[#667085]">{latestInspection.summary.lowPriority}</div>
              <div className="text-[10px] text-[#667085] font-semibold uppercase">Low</div>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E4E7EC] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#111827]">Room Breakdown</h2>
            <span className="text-xs text-[#667085] font-medium bg-[#F7F8FA] px-2.5 py-1 rounded-full">
              {latestInspection.summary.roomsInspected} of {latestInspection.summary.totalRooms} Inspected
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latestInspection.rooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={() => console.log('View room', room.id)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Past Inspections */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6">
        <div className="flex items-center gap-2 mb-6">
          <History size={18} className="text-[#667085]" />
          <h2 className="text-sm font-bold text-[#111827]">Inspection History</h2>
        </div>

        <div className="space-y-3">
          {[DEMO_MOVE_OUT_INSPECTION, DEMO_MOVE_IN_INSPECTION].map(insp => (
            <div key={insp.id} className="flex items-center justify-between p-4 rounded-xl border border-[#F7F8FA] hover:border-[#E4E7EC] hover:bg-[#F7F8FA]/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  insp.overallScore >= 80 ? 'bg-[#ECFDF3] text-[#027A48]' : 
                  insp.overallScore >= 60 ? 'bg-[#FFFAEB] text-[#B54708]' : 'bg-[#FEF3F2] text-[#B42318]'
                }`}>
                  {insp.overallScore}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#111827]">
                      {insp.type === 'move_in' ? 'Move-In Inspection' : 'Move-Out Inspection'}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7F8FA] text-[#667085] uppercase">
                      {new Date(insp.completedAt!).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] mt-0.5">
                    {insp.summary.totalIssues} issues found across {insp.summary.roomsInspected} rooms • {insp.summary.totalImages} images analyzed
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#D0D5DD] group-hover:text-[#3157FF] transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
