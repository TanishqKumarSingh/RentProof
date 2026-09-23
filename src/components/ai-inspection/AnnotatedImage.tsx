import React, { useState } from 'react';
import type { AIFinding, BoundingBox } from '../../types/inspection';
import { SEVERITY_CONFIG } from '../../types/inspection';

interface AnnotatedImageProps {
  imageUrl: string;
  findings: AIFinding[];
  onFindingClick?: (finding: AIFinding) => void;
  className?: string;
  showLabels?: boolean;
}

/**
 * Renders an uploaded image with SVG bounding box overlays for AI findings.
 * Red for high severity, orange for medium, muted for low.
 * Click a box to open the corresponding finding.
 */
export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({
  imageUrl,
  findings,
  onFindingClick,
  className = '',
  showLabels = true,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hasImage = imageUrl && imageUrl !== '' && imageUrl !== '#';

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#E4E7EC] bg-gray-100 ${className}`}>
      {/* Image or gradient placeholder */}
      {hasImage ? (
        <img
          src={imageUrl}
          alt="Property inspection"
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center min-h-[200px]">
          <span className="text-gray-400 text-sm">Property Photo</span>
        </div>
      )}

      {/* SVG overlay for bounding boxes */}
      {findings.length > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {findings.map((f, idx) => {
            const bb = f.boundingBox;
            const config = SEVERITY_CONFIG[f.severity];
            const isHovered = hoveredId === f.id;

            return (
              <g key={f.id} className="pointer-events-auto cursor-pointer"
                 onMouseEnter={() => setHoveredId(f.id)}
                 onMouseLeave={() => setHoveredId(null)}
                 onClick={() => onFindingClick?.(f)}>
                {/* Bounding box rectangle */}
                <rect
                  x={bb.x} y={bb.y} width={bb.w} height={bb.h}
                  fill={isHovered ? `${config.color}22` : `${config.color}11`}
                  stroke={config.color}
                  strokeWidth={isHovered ? 0.8 : 0.5}
                  strokeDasharray={f.severity === 'low' ? '1,0.5' : 'none'}
                  rx={0.5}
                />
                {/* Corner markers */}
                {renderCorners(bb, config.color, isHovered)}
                {/* Label */}
                {showLabels && (
                  <>
                    <rect
                      x={bb.x} y={bb.y - 4}
                      width={Math.max(bb.w, 12)} height={3.5}
                      fill={config.color} rx={0.5}
                    />
                    <text
                      x={bb.x + 0.8} y={bb.y - 1.3}
                      fill="white"
                      fontSize="2"
                      fontWeight="bold"
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      #{String(idx + 1).padStart(2, '0')} {Math.round(f.confidence * 100)}%
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* Finding count badge */}
      {findings.length > 0 && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
          {findings.length} issue{findings.length > 1 ? 's' : ''} detected
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredId && (() => {
        const f = findings.find(f => f.id === hoveredId);
        if (!f) return null;
        const config = SEVERITY_CONFIG[f.severity];
        return (
          <div
            className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-lg border p-3 shadow-lg z-10 pointer-events-none"
            style={{ borderColor: config.color }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-xs font-bold text-[#111827]">{f.type}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: config.bg, color: config.color }}>
                {config.label}
              </span>
              <span className="text-[10px] text-[#667085] ml-auto">{Math.round(f.confidence * 100)}% confidence</span>
            </div>
            <p className="text-[11px] text-[#667085] leading-snug line-clamp-2">{f.description}</p>
          </div>
        );
      })()}
    </div>
  );
};

function renderCorners(bb: BoundingBox, color: string, isHovered: boolean) {
  const s = isHovered ? 2.5 : 2;
  const sw = isHovered ? 0.7 : 0.5;
  return (
    <>
      {/* Top-left */}
      <line x1={bb.x} y1={bb.y} x2={bb.x + s} y2={bb.y} stroke={color} strokeWidth={sw} />
      <line x1={bb.x} y1={bb.y} x2={bb.x} y2={bb.y + s} stroke={color} strokeWidth={sw} />
      {/* Top-right */}
      <line x1={bb.x + bb.w} y1={bb.y} x2={bb.x + bb.w - s} y2={bb.y} stroke={color} strokeWidth={sw} />
      <line x1={bb.x + bb.w} y1={bb.y} x2={bb.x + bb.w} y2={bb.y + s} stroke={color} strokeWidth={sw} />
      {/* Bottom-left */}
      <line x1={bb.x} y1={bb.y + bb.h} x2={bb.x + s} y2={bb.y + bb.h} stroke={color} strokeWidth={sw} />
      <line x1={bb.x} y1={bb.y + bb.h} x2={bb.x} y2={bb.y + bb.h - s} stroke={color} strokeWidth={sw} />
      {/* Bottom-right */}
      <line x1={bb.x + bb.w} y1={bb.y + bb.h} x2={bb.x + bb.w - s} y2={bb.y + bb.h} stroke={color} strokeWidth={sw} />
      <line x1={bb.x + bb.w} y1={bb.y + bb.h} x2={bb.x + bb.w} y2={bb.y + bb.h - s} stroke={color} strokeWidth={sw} />
    </>
  );
}
