import React, { useRef } from 'react';
import { UploadCloud, Camera, CheckCircle2, Circle } from 'lucide-react';
import type { InspectionImage } from '../../types/inspection';

interface ImageUploadZoneProps {
  roomName: string;
  areas: string[];
  images: InspectionImage[];
  onUpload: (area: string, fileUrl: string) => void;
  isAnalyzing?: boolean;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({ 
  roomName, 
  areas, 
  images, 
  onUpload,
  isAnalyzing = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeArea, setActiveArea] = React.useState<string>(areas[0] || 'Walls');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(activeArea, url);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getAreaImageCount = (area: string) => images.filter(img => img.area === area).length;

  return (
    <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden">
      <div className="p-4 border-b border-[#E4E7EC] bg-[#F7F8FA]">
        <h3 className="text-sm font-bold text-[#111827]">Capture: {roomName}</h3>
        <p className="text-xs text-[#667085] mt-1">Select an area and upload or capture photos.</p>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Area Checklist */}
        <div className="w-full md:w-1/3 border-r border-[#E4E7EC] bg-white p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
          {areas.map(area => {
            const count = getAreaImageCount(area);
            const isDone = count > 0;
            return (
              <button
                key={area}
                onClick={() => setActiveArea(area)}
                disabled={isAnalyzing}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeArea === area 
                    ? 'bg-[#3157FF]/5 text-[#3157FF] font-semibold' 
                    : 'hover:bg-[#F7F8FA] text-[#667085]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDone ? <CheckCircle2 size={16} className="text-[#12B76A]" /> : <Circle size={16} className="text-[#D0D5DD]" />}
                  <span>{area}</span>
                </div>
                {count > 0 && (
                  <span className="text-[10px] font-bold bg-[#F7F8FA] px-2 py-0.5 rounded-full border border-[#E4E7EC] text-[#667085]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Upload Zone */}
        <div className="w-full md:w-2/3 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#111827]">Current Area: <span className="text-[#3157FF]">{activeArea}</span></span>
            <span className="text-xs text-[#667085]">{getAreaImageCount(activeArea)} photo(s)</span>
          </div>

          <div 
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-colors min-h-[200px] ${
              isAnalyzing 
                ? 'border-[#E4E7EC] bg-[#F7F8FA] opacity-50 cursor-not-allowed' 
                : 'border-[#D0D5DD] hover:border-[#3157FF] hover:bg-[#3157FF]/5 cursor-pointer bg-[#F7F8FA]'
            }`}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#3157FF] mb-3">
              <Camera size={24} />
            </div>
            <p className="text-sm font-semibold text-[#111827]">Capture {activeArea}</p>
            <p className="text-xs text-[#667085] mt-1 max-w-[200px]">
              Take a photo or upload from device to analyze visible condition.
            </p>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          {/* Thumbnails of current area */}
          {getAreaImageCount(activeArea) > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {images.filter(i => i.area === activeArea).map(img => (
                <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E4E7EC] flex-shrink-0">
                  {img.url && img.url !== '' && img.url !== '#' ? (
                    <img src={img.url} alt={img.area} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
