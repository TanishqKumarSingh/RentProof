/**
 * Demo AI Inspection Data
 * Used as fallback when browsing past inspections in demo mode.
 * Real inspections are created through the wizard with actual image uploads.
 */

import type { AIInspection, AIFinding, InspectionRoom, InspectionImage } from '../types/inspection';

// ─── Helper to create demo images (gradient placeholders) ───
function demoImg(id: string, roomId: string, area: string, ts: string): InspectionImage {
  return { id, roomId, url: '', area, fileName: `${area.toLowerCase().replace(/\s/g, '_')}.jpg`, timestamp: ts };
}

// ─── Move-In Inspection (Oct 2025) ───
const moveInRooms: InspectionRoom[] = [
  {
    id: 'mi-bed', name: 'Bedroom', status: 'complete', conditionScore: 76,
    images: [
      demoImg('mi-img-01', 'mi-bed', 'Walls', '2025-10-02T09:10:00Z'),
      demoImg('mi-img-02', 'mi-bed', 'Ceiling', '2025-10-02T09:12:00Z'),
      demoImg('mi-img-03', 'mi-bed', 'Floor', '2025-10-02T09:14:00Z'),
      demoImg('mi-img-04', 'mi-bed', 'Windows', '2025-10-02T09:15:00Z'),
      demoImg('mi-img-05', 'mi-bed', 'Electrical', '2025-10-02T09:17:00Z'),
      demoImg('mi-img-06', 'mi-bed', 'Furniture', '2025-10-02T09:19:00Z'),
    ],
    findings: [
      { id: 'mi-f01', category: 'structural', type: 'Wall Crack', severity: 'medium', confidence: 0.94, location: 'Bedroom — North Wall', description: 'Visible vertical crack approximately 25–30 cm long running downward from ceiling junction.', recommendation: 'Document and monitor. Surface repair with filler and repaint.', boundingBox: { x: 62, y: 15, w: 8, h: 35 }, imageId: 'mi-img-01', timestamp: '2025-10-02T09:10:00Z' },
      { id: 'mi-f02', category: 'structural', type: 'Paint Peeling', severity: 'low', confidence: 0.88, location: 'Bedroom — East Wall', description: 'Small area of paint peeling near window frame, ~10×15 cm.', recommendation: 'Scrape, prime, and repaint.', boundingBox: { x: 78, y: 42, w: 12, h: 14 }, imageId: 'mi-img-01', timestamp: '2025-10-02T09:10:00Z' },
      { id: 'mi-f03', category: 'electrical', type: 'Damaged Socket', severity: 'high', confidence: 0.91, location: 'Bedroom — Near Door', description: 'Socket faceplate has visible crack. One slot appears discolored.', recommendation: 'Replace socket. Have electrician inspect wiring.', boundingBox: { x: 15, y: 55, w: 10, h: 12 }, imageId: 'mi-img-05', timestamp: '2025-10-02T09:17:00Z' },
      { id: 'mi-f04', category: 'furniture', type: 'Surface Scratch', severity: 'low', confidence: 0.79, location: 'Bedroom — Desk', description: 'Multiple light scratches on desk surface, ~15–20 cm long.', recommendation: 'Document for record. Minor cosmetic, does not affect function.', boundingBox: { x: 20, y: 60, w: 30, h: 15 }, imageId: 'mi-img-06', timestamp: '2025-10-02T09:19:00Z' },
    ],
  },
  {
    id: 'mi-bath', name: 'Bathroom', status: 'complete', conditionScore: 71,
    images: [
      demoImg('mi-img-07', 'mi-bath', 'Walls', '2025-10-02T09:25:00Z'),
      demoImg('mi-img-08', 'mi-bath', 'Tiles', '2025-10-02T09:27:00Z'),
      demoImg('mi-img-09', 'mi-bath', 'Shower/Tap', '2025-10-02T09:29:00Z'),
      demoImg('mi-img-10', 'mi-bath', 'Sink', '2025-10-02T09:31:00Z'),
    ],
    findings: [
      { id: 'mi-f05', category: 'structural', type: 'Tile Damage', severity: 'medium', confidence: 0.89, location: 'Bathroom — Floor Tiles', description: 'One floor tile has diagonal crack. Adjacent tile has minor chipping.', recommendation: 'Replace cracked tile. Seal chip.', boundingBox: { x: 25, y: 70, w: 18, h: 15 }, imageId: 'mi-img-08', timestamp: '2025-10-02T09:27:00Z' },
      { id: 'mi-f06', category: 'plumbing', type: 'Water Stain', severity: 'low', confidence: 0.74, location: 'Bathroom — Near Shower', description: 'Minor water staining on wall near shower area. Appears old/dried.', recommendation: 'Monitor for active leakage. Clean stain.', boundingBox: { x: 50, y: 40, w: 15, h: 20 }, imageId: 'mi-img-07', timestamp: '2025-10-02T09:25:00Z' },
      { id: 'mi-f07', category: 'plumbing', type: 'Loose Tap', severity: 'low', confidence: 0.72, location: 'Bathroom — Sink Tap', description: 'Sink tap appears slightly loose. Wobbles when operated.', recommendation: 'Tighten tap fitting. Replace washer if leaking.', boundingBox: { x: 45, y: 50, w: 12, h: 15 }, imageId: 'mi-img-10', timestamp: '2025-10-02T09:31:00Z' },
    ],
  },
  {
    id: 'mi-kit', name: 'Kitchen', status: 'complete', conditionScore: 82,
    images: [
      demoImg('mi-img-11', 'mi-kit', 'Walls', '2025-10-02T09:35:00Z'),
      demoImg('mi-img-12', 'mi-kit', 'Cabinets', '2025-10-02T09:37:00Z'),
      demoImg('mi-img-13', 'mi-kit', 'Sink', '2025-10-02T09:39:00Z'),
      demoImg('mi-img-14', 'mi-kit', 'Countertop', '2025-10-02T09:41:00Z'),
    ],
    findings: [
      { id: 'mi-f08', category: 'structural', type: 'Wall Staining', severity: 'low', confidence: 0.85, location: 'Kitchen — Behind Stove', description: 'Grease discoloration behind cooking area, ~40×30 cm.', recommendation: 'Deep clean with degreaser. Repaint if needed.', boundingBox: { x: 30, y: 35, w: 25, h: 20 }, imageId: 'mi-img-11', timestamp: '2025-10-02T09:35:00Z' },
      { id: 'mi-f09', category: 'furniture', type: 'Cabinet Damage', severity: 'medium', confidence: 0.87, location: 'Kitchen — Upper Cabinet', description: 'Cabinet door hinge loose, door hangs slightly misaligned. Laminate peeling.', recommendation: 'Tighten hinge. Re-glue laminate.', boundingBox: { x: 55, y: 10, w: 20, h: 25 }, imageId: 'mi-img-12', timestamp: '2025-10-02T09:37:00Z' },
      { id: 'mi-f10', category: 'plumbing', type: 'Tap Dripping', severity: 'medium', confidence: 0.76, location: 'Kitchen — Sink', description: 'Possible slow drip at tap base. Water marks suggest minor leakage.', recommendation: 'Replace tap washer or cartridge.', boundingBox: { x: 40, y: 50, w: 15, h: 18 }, imageId: 'mi-img-13', timestamp: '2025-10-02T09:39:00Z' },
    ],
  },
  {
    id: 'mi-liv', name: 'Living Room', status: 'complete', conditionScore: 91,
    images: [
      demoImg('mi-img-15', 'mi-liv', 'Walls', '2025-10-02T09:45:00Z'),
      demoImg('mi-img-16', 'mi-liv', 'Floor', '2025-10-02T09:47:00Z'),
      demoImg('mi-img-17', 'mi-liv', 'Windows', '2025-10-02T09:49:00Z'),
    ],
    findings: [
      { id: 'mi-f11', category: 'structural', type: 'Paint Damage', severity: 'low', confidence: 0.83, location: 'Living Room — Near Window', description: 'Minor paint bubbling near window frame, ~8 cm area.', recommendation: 'Scrape, prime, and repaint.', boundingBox: { x: 72, y: 30, w: 10, h: 12 }, imageId: 'mi-img-15', timestamp: '2025-10-02T09:45:00Z' },
    ],
  },
  {
    id: 'mi-bal', name: 'Balcony', status: 'complete', conditionScore: 88,
    images: [
      demoImg('mi-img-18', 'mi-bal', 'Walls', '2025-10-02T09:55:00Z'),
      demoImg('mi-img-19', 'mi-bal', 'Railing', '2025-10-02T09:57:00Z'),
      demoImg('mi-img-20', 'mi-bal', 'Floor', '2025-10-02T09:59:00Z'),
    ],
    findings: [
      { id: 'mi-f12', category: 'structural', type: 'Railing Rust', severity: 'low', confidence: 0.86, location: 'Balcony — Railing', description: 'Surface rust on metal railing at two points.', recommendation: 'Sand and apply anti-rust primer and paint.', boundingBox: { x: 10, y: 45, w: 35, h: 10 }, imageId: 'mi-img-19', timestamp: '2025-10-02T09:57:00Z' },
    ],
  },
];

export const DEMO_MOVE_IN_INSPECTION: AIInspection = {
  id: 'ai-insp-movein',
  agreementId: 'demo-agreement',
  propertyId: 'demo-property',
  inspectorId: 'demo-tenant',
  type: 'move_in',
  status: 'complete',
  overallScore: 78,
  rooms: moveInRooms,
  summary: {
    totalIssues: 12, highPriority: 1, mediumPriority: 5, lowPriority: 6,
    roomsInspected: 5, totalRooms: 5, totalImages: 20, completeness: 100,
  },
  createdAt: '2025-10-02T09:00:00Z',
  completedAt: '2025-10-02T10:15:00Z',
};

// ─── Move-Out Inspection (Sep 2026) — has new damage + some repaired ───
const moveOutRooms: InspectionRoom[] = [
  {
    id: 'mo-bed', name: 'Bedroom', status: 'complete', conditionScore: 62,
    images: [
      demoImg('mo-img-01', 'mo-bed', 'Walls', '2026-09-23T10:10:00Z'),
      demoImg('mo-img-02', 'mo-bed', 'Ceiling', '2026-09-23T10:12:00Z'),
      demoImg('mo-img-03', 'mo-bed', 'Floor', '2026-09-23T10:14:00Z'),
      demoImg('mo-img-04', 'mo-bed', 'Electrical', '2026-09-23T10:16:00Z'),
      demoImg('mo-img-05', 'mo-bed', 'Furniture', '2026-09-23T10:18:00Z'),
    ],
    findings: [
      { id: 'mo-f01', category: 'structural', type: 'Wall Crack', severity: 'high', confidence: 0.96, location: 'Bedroom — North Wall', description: 'Crack has widened significantly since move-in. Now ~40 cm long with visible depth. Branching crack also visible.', recommendation: 'Urgent structural inspection recommended. Do not attempt cosmetic repair until assessed.', boundingBox: { x: 60, y: 12, w: 12, h: 40 }, imageId: 'mo-img-01', timestamp: '2026-09-23T10:10:00Z' },
      { id: 'mo-f02', category: 'structural', type: 'Water Stain', severity: 'medium', confidence: 0.82, location: 'Bedroom — Ceiling Center', description: 'New brownish discoloration ~30 cm on ceiling. Not present during move-in.', recommendation: 'Investigate source from upper floor. Repair before painting.', boundingBox: { x: 35, y: 25, w: 25, h: 20 }, imageId: 'mo-img-02', timestamp: '2026-09-23T10:12:00Z' },
      { id: 'mo-f03', category: 'furniture', type: 'Surface Scratch', severity: 'low', confidence: 0.79, location: 'Bedroom — Desk', description: 'Pre-existing scratches. No significant change from move-in condition.', recommendation: 'No action required. Consistent with move-in state.', boundingBox: { x: 20, y: 60, w: 30, h: 15 }, imageId: 'mo-img-05', timestamp: '2026-09-23T10:18:00Z' },
      { id: 'mo-f04', category: 'furniture', type: 'Significant Damage', severity: 'high', confidence: 0.93, location: 'Bedroom — Wardrobe Door', description: 'Large dent and scratch on wardrobe door. Not present during move-in. Appears to be impact damage.', recommendation: 'Door panel may need replacement. Document for deposit review.', boundingBox: { x: 65, y: 40, w: 18, h: 25 }, imageId: 'mo-img-05', timestamp: '2026-09-23T10:18:00Z' },
    ],
  },
  {
    id: 'mo-bath', name: 'Bathroom', status: 'complete', conditionScore: 64,
    images: [
      demoImg('mo-img-06', 'mo-bath', 'Walls', '2026-09-23T10:25:00Z'),
      demoImg('mo-img-07', 'mo-bath', 'Tiles', '2026-09-23T10:27:00Z'),
      demoImg('mo-img-08', 'mo-bath', 'Shower/Tap', '2026-09-23T10:29:00Z'),
    ],
    findings: [
      { id: 'mo-f05', category: 'structural', type: 'Tile Damage', severity: 'medium', confidence: 0.89, location: 'Bathroom — Floor Tiles', description: 'Same cracked tile as move-in. Chip has grown slightly larger.', recommendation: 'Replace tile. Existing damage has worsened.', boundingBox: { x: 25, y: 70, w: 18, h: 15 }, imageId: 'mo-img-07', timestamp: '2026-09-23T10:27:00Z' },
      { id: 'mo-f06', category: 'plumbing', type: 'Water Leakage', severity: 'high', confidence: 0.92, location: 'Bathroom — Shower Area', description: 'Active water seepage at shower wall-floor junction. Significant staining. New damage not present at move-in.', recommendation: 'Urgently reseal junction. Check for structural water damage.', boundingBox: { x: 15, y: 60, w: 22, h: 25 }, imageId: 'mo-img-08', timestamp: '2026-09-23T10:29:00Z' },
      { id: 'mo-f07', category: 'structural', type: 'Dampness', severity: 'medium', confidence: 0.78, location: 'Bathroom — Lower Wall', description: 'Dampness on lower wall has become more visible. Possible mold forming.', recommendation: 'Anti-mold treatment needed. Check waterproofing.', boundingBox: { x: 50, y: 65, w: 20, h: 20 }, imageId: 'mo-img-06', timestamp: '2026-09-23T10:25:00Z' },
    ],
  },
  {
    id: 'mo-kit', name: 'Kitchen', status: 'complete', conditionScore: 80,
    images: [
      demoImg('mo-img-09', 'mo-kit', 'Walls', '2026-09-23T10:35:00Z'),
      demoImg('mo-img-10', 'mo-kit', 'Cabinets', '2026-09-23T10:37:00Z'),
      demoImg('mo-img-11', 'mo-kit', 'Sink', '2026-09-23T10:39:00Z'),
    ],
    findings: [
      { id: 'mo-f08', category: 'structural', type: 'Wall Staining', severity: 'low', confidence: 0.85, location: 'Kitchen — Behind Stove', description: 'Pre-existing grease staining. Unchanged from move-in.', recommendation: 'Deep clean during move-out.', boundingBox: { x: 30, y: 35, w: 25, h: 20 }, imageId: 'mo-img-09', timestamp: '2026-09-23T10:35:00Z' },
      { id: 'mo-f09', category: 'furniture', type: 'Cabinet Damage', severity: 'medium', confidence: 0.87, location: 'Kitchen — Upper Cabinet', description: 'Cabinet hinge still loose (unchanged). Laminate peeling slightly worse.', recommendation: 'Repair hinge. Re-glue laminate.', boundingBox: { x: 55, y: 10, w: 20, h: 25 }, imageId: 'mo-img-10', timestamp: '2026-09-23T10:37:00Z' },
    ],
  },
  {
    id: 'mo-liv', name: 'Living Room', status: 'complete', conditionScore: 85,
    images: [
      demoImg('mo-img-12', 'mo-liv', 'Walls', '2026-09-23T10:45:00Z'),
      demoImg('mo-img-13', 'mo-liv', 'Floor', '2026-09-23T10:47:00Z'),
    ],
    findings: [
      { id: 'mo-f10', category: 'structural', type: 'Paint Damage', severity: 'low', confidence: 0.83, location: 'Living Room — Near Window', description: 'Paint bubbling unchanged from move-in.', recommendation: 'Repaint during turnover.', boundingBox: { x: 72, y: 30, w: 10, h: 12 }, imageId: 'mo-img-12', timestamp: '2026-09-23T10:45:00Z' },
      { id: 'mo-f11', category: 'structural', type: 'Floor Scratch', severity: 'low', confidence: 0.77, location: 'Living Room — Center', description: 'New light scratch marks on floor, possibly from furniture movement. ~30 cm long.', recommendation: 'Buff or polish floor. Minor cosmetic.', boundingBox: { x: 35, y: 55, w: 25, h: 8 }, imageId: 'mo-img-13', timestamp: '2026-09-23T10:47:00Z' },
    ],
  },
  {
    id: 'mo-bal', name: 'Balcony', status: 'complete', conditionScore: 90,
    images: [
      demoImg('mo-img-14', 'mo-bal', 'Railing', '2026-09-23T10:55:00Z'),
      demoImg('mo-img-15', 'mo-bal', 'Floor', '2026-09-23T10:57:00Z'),
    ],
    findings: [],  // Railing was repaired — no findings
  },
];

export const DEMO_MOVE_OUT_INSPECTION: AIInspection = {
  id: 'ai-insp-moveout',
  agreementId: 'demo-agreement',
  propertyId: 'demo-property',
  inspectorId: 'demo-tenant',
  type: 'move_out',
  status: 'complete',
  overallScore: 68,
  rooms: moveOutRooms,
  summary: {
    totalIssues: 15, highPriority: 3, mediumPriority: 5, lowPriority: 7,
    roomsInspected: 5, totalRooms: 5, totalImages: 15, completeness: 100,
  },
  createdAt: '2026-09-23T10:00:00Z',
  completedAt: '2026-09-23T11:15:00Z',
};
