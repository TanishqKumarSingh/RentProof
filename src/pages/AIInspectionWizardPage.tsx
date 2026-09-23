import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, ChevronRight, ChevronLeft, Loader2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AVAILABLE_ROOMS, ROOM_AREAS } from '../types/inspection';
import type { InspectionRoom, InspectionImage, AIFinding } from '../types/inspection';
import { analyzeRoomImages, generateConditionScore } from '../services/inspectionAIService';
import { ImageUploadZone } from '../components/ai-inspection/ImageUploadZone';
import { AnnotatedImage } from '../components/ai-inspection/AnnotatedImage';
import { FindingCard } from '../components/ai-inspection/FindingCard';
import { ConditionScoreGauge } from '../components/ai-inspection/ConditionScoreGauge';

export default function AIInspectionWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [inspType, setInspType] = useState<'move_in' | 'move_out' | 'routine'>('move_in');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  
  // State for active inspection data
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [roomsData, setRoomsData] = useState<InspectionRoom[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  // Initialize rooms data when transitioning to capture step
  const handleStartCapture = () => {
    if (selectedRooms.length === 0) return;
    setRoomsData(selectedRooms.map(name => ({
      id: `room-${Date.now()}-${name}`,
      name,
      images: [],
      findings: [],
      conditionScore: 100,
      status: 'pending'
    })));
    setStep(3);
  };

  const handleImageUpload = (roomName: string, area: string, fileUrl: string) => {
    setRoomsData(prev => prev.map(r => {
      if (r.name !== roomName) return r;
      const newImg: InspectionImage = {
        id: `img-${Date.now()}`,
        roomId: r.id,
        url: fileUrl,
        area,
        fileName: `${area}.jpg`,
        timestamp: new Date().toISOString()
      };
      return { ...r, images: [...r.images, newImg] };
    }));
  };

  const handleAnalyzeRoom = async () => {
    const currentRoom = roomsData[activeRoomIdx];
    if (currentRoom.images.length === 0) return;

    setIsAnalyzing(true);
    setRoomsData(prev => prev.map((r, i) => i === activeRoomIdx ? { ...r, status: 'analyzing' } : r));

    try {
      const findings = await analyzeRoomImages(currentRoom.name, currentRoom.images);
      const score = generateConditionScore(findings);

      setRoomsData(prev => prev.map((r, i) => i === activeRoomIdx ? { 
        ...r, 
        findings, 
        conditionScore: score, 
        status: 'complete' 
      } : r));

      // Move to next room or finish
      if (activeRoomIdx < roomsData.length - 1) {
        setActiveRoomIdx(prev => prev + 1);
      } else {
        // Calculate overall score and move to results
        const allFindings = roomsData.flatMap(r => r.id === currentRoom.id ? findings : r.findings);
        setOverallScore(generateConditionScore(allFindings));
        setStep(4);
      }
    } catch (err) {
      console.error(err);
      // In a real app, handle error state here
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-4 md:p-6 mb-6 flex items-center justify-between sticky top-4 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => step === 1 ? navigate('/ai-inspect') : setStep(prev => (prev - 1) as any)} className="w-8 h-8 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#667085] hover:bg-[#E4E7EC] transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#111827]">New AI Inspection</h1>
            <p className="text-xs text-[#667085]">Step {step} of 4</p>
          </div>
        </div>
        
        {/* Progress Dots */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-[#3157FF]' : i < step ? 'bg-[#12B76A]' : 'bg-[#E4E7EC]'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Type Selection */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-2">What are we inspecting today?</h2>
              <p className="text-[#667085]">Select the type of inspection to set the correct baseline.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'move_in', title: 'Move-In', desc: 'Establish the initial condition baseline before moving in.' },
                { id: 'move_out', title: 'Move-Out', desc: 'Compare against move-in to determine deposit deductions.' },
                { id: 'routine', title: 'Routine', desc: 'Periodic check-up for maintenance and upkeep.' }
              ].map(type => (
                <div 
                  key={type.id} 
                  onClick={() => setInspType(type.id as any)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${inspType === type.id ? 'border-[#3157FF] bg-[#3157FF]/5' : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD]'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mb-4 flex items-center justify-center ${inspType === type.id ? 'border-[#3157FF] bg-[#3157FF]' : 'border-[#D0D5DD]'}`}>
                    {inspType === type.id && <Check size={14} className="text-white" />}
                  </div>
                  <h3 className="font-bold text-[#111827] mb-2">{type.title} Inspection</h3>
                  <p className="text-sm text-[#667085] leading-relaxed">{type.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} className="bg-[#3157FF] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors">
                Next: Select Rooms <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Room Selection */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-2">Which rooms are you inspecting?</h2>
              <p className="text-[#667085]">Select all areas that apply to this property.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {AVAILABLE_ROOMS.map(room => {
                const isSel = selectedRooms.includes(room);
                return (
                  <button
                    key={room}
                    onClick={() => setSelectedRooms(prev => isSel ? prev.filter(r => r !== room) : [...prev, room])}
                    className={`p-4 rounded-xl border text-center transition-all ${isSel ? 'bg-[#3157FF] border-[#3157FF] text-white shadow-md' : 'bg-white border-[#E4E7EC] text-[#344054] hover:border-[#D0D5DD]'}`}
                  >
                    <span className="font-semibold text-sm block">{room}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-[#E4E7EC]">
              <span className="text-[#667085] font-medium flex items-center">{selectedRooms.length} rooms selected</span>
              <button 
                onClick={handleStartCapture} 
                disabled={selectedRooms.length === 0}
                className="bg-[#3157FF] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Capture <Camera size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Capture & Analyze */}
        {step === 3 && roomsData.length > 0 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
              {roomsData.map((room, idx) => (
                <div key={room.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border ${idx === activeRoomIdx ? 'bg-[#111827] text-white border-[#111827]' : room.status === 'complete' ? 'bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]' : 'bg-white text-[#667085] border-[#E4E7EC]'}`}>
                  {room.status === 'complete' && <CheckCircle2 size={14} />}
                  {room.name}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-900 mb-6">
              <Sparkles className="flex-shrink-0 text-[#3157FF]" size={20} />
              <div>
                <p className="font-bold mb-1">AI Assistant is ready</p>
                <p className="text-blue-700/80 leading-relaxed">Follow the checklist on the left to capture all necessary areas of the {roomsData[activeRoomIdx].name}. Once you've taken enough photos, click Analyze to let AI detect any visible issues.</p>
              </div>
            </div>

            <ImageUploadZone 
              roomName={roomsData[activeRoomIdx].name}
              areas={ROOM_AREAS[roomsData[activeRoomIdx].name]}
              images={roomsData[activeRoomIdx].images}
              onUpload={(area, url) => handleImageUpload(roomsData[activeRoomIdx].name, area, url)}
              isAnalyzing={isAnalyzing}
            />

            <div className="flex justify-end mt-6">
              <button 
                onClick={handleAnalyzeRoom} 
                disabled={isAnalyzing || roomsData[activeRoomIdx].images.length === 0}
                className="bg-[#111827] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center shadow-lg"
              >
                {isAnalyzing ? (
                  <><Loader2 size={18} className="animate-spin" /> Analyzing Images...</>
                ) : (
                  <><Sparkles size={18} /> Analyze {roomsData[activeRoomIdx].name}</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Results Report */}
        {step === 4 && overallScore !== null && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="text-center py-6 border-b border-[#E4E7EC]">
              <div className="inline-flex items-center gap-2 bg-[#ECFDF3] text-[#027A48] px-3 py-1 rounded-full text-xs font-bold mb-6">
                <CheckCircle2 size={14} /> Analysis Complete
              </div>
              <ConditionScoreGauge score={overallScore} size={200} />
              <h2 className="text-2xl font-bold text-[#111827] mt-6">Property Condition Report</h2>
              <p className="text-[#667085] mt-2 max-w-lg mx-auto">AI has analyzed {roomsData.reduce((a, r) => a + r.images.length, 0)} images across {roomsData.length} rooms. Please review the findings below.</p>
            </div>

            <div className="space-y-8">
              {roomsData.map(room => (
                <div key={room.id} className="bg-white rounded-2xl border border-[#E4E7EC] overflow-hidden shadow-sm">
                  <div className="bg-[#F7F8FA] px-6 py-4 border-b border-[#E4E7EC] flex items-center justify-between">
                    <h3 className="font-bold text-[#111827] text-lg">{room.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">Score: {room.conditionScore}/100</span>
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded border shadow-sm">
                        {room.findings.length} issues
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {room.findings.length === 0 ? (
                      <div className="text-center py-8 text-[#667085]">
                        <CheckCircle2 size={32} className="mx-auto text-[#12B76A] mb-3 opacity-50" />
                        <p className="font-medium text-[#111827]">No visible issues detected.</p>
                        <p className="text-sm mt-1">Condition appears satisfactory based on provided images.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Findings List */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                          <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">Detected Issues</h4>
                          {room.findings.map((finding, idx) => (
                            <FindingCard key={finding.id} finding={finding} index={idx} />
                          ))}
                        </div>
                        {/* Annotated Image View */}
                        <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#E4E7EC] h-[400px] flex flex-col">
                          <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Camera size={14} /> AI Annotations
                          </h4>
                          {/* Just showing the first image that has findings for simplicity in UI, real app might want a carousel */}
                          {(() => {
                            const firstFindingImg = room.findings[0]?.imageId;
                            const imgData = room.images.find(i => i.id === firstFindingImg) || room.images[0];
                            const findingsForImg = room.findings.filter(f => f.imageId === imgData.id);
                            
                            return imgData ? (
                              <AnnotatedImage 
                                imageUrl={imgData.url} 
                                findings={findingsForImg}
                                className="flex-1 min-h-0"
                              />
                            ) : (
                              <div className="flex-1 flex items-center justify-center text-gray-400">No image data</div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FFFAEB] border border-[#FEDF89] p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-[#B54708] flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-[#B54708] font-medium leading-relaxed">
                <strong className="block mb-1">Important Disclaimer</strong>
                RentProof AI identifies visible signs from photographs. It does not replace a professional structural, electrical, plumbing, or safety inspection. Always seek professional advice for severe issues.
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <button 
                onClick={() => navigate('/ai-inspect')}
                className="bg-[#111827] text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
              >
                Save Inspection Report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
