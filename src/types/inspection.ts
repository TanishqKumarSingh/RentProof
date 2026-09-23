// ─── AI Inspection Type System ───

export type FindingCategory = 'structural' | 'electrical' | 'doors_windows' | 'plumbing' | 'furniture';
export type FindingSeverity = 'high' | 'medium' | 'low';
export type InspectionType = 'move_in' | 'move_out' | 'routine';
export type RoomStatus = 'pending' | 'capturing' | 'analyzing' | 'complete';
export type InspectionStatus = 'in_progress' | 'complete';
export type ChangeType = 'new_damage' | 'worsened' | 'repaired' | 'unchanged' | 'existing';

export interface BoundingBox {
  x: number; // % from left
  y: number; // % from top
  w: number; // % width
  h: number; // % height
}

export interface AIFinding {
  id: string;
  category: FindingCategory;
  type: string;
  severity: FindingSeverity;
  confidence: number;         // 0.0 – 1.0
  location: string;
  description: string;
  recommendation: string;
  boundingBox: BoundingBox;
  imageId: string;
  timestamp: string;
}

export interface InspectionImage {
  id: string;
  roomId: string;
  url: string;                // object URL, data URL, or placeholder
  area: string;               // "Walls", "Ceiling", "Floor", etc.
  fileName: string;
  timestamp: string;
}

export interface InspectionRoom {
  id: string;
  name: string;
  images: InspectionImage[];
  findings: AIFinding[];
  conditionScore: number;     // 0–100
  status: RoomStatus;
}

export interface InspectionSummary {
  totalIssues: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  roomsInspected: number;
  totalRooms: number;
  totalImages: number;
  completeness: number;       // 0–100
}

export interface AIInspection {
  id: string;
  agreementId: string;
  propertyId: string;
  inspectorId: string;
  type: InspectionType;
  status: InspectionStatus;
  overallScore: number;
  rooms: InspectionRoom[];
  summary: InspectionSummary;
  createdAt: string;
  completedAt: string | null;
}

export interface DamageComparison {
  id: string;
  roomName: string;
  findingType: string;
  moveInState: string;
  moveOutState: string;
  changeType: ChangeType;
  severity: FindingSeverity;
  confidence: number;
  moveInImageId: string | null;
  moveOutImageId: string | null;
}

// Room areas for guided scanning
export const ROOM_AREAS: Record<string, string[]> = {
  'Bedroom':     ['Walls', 'Ceiling', 'Floor', 'Windows', 'Door', 'Electrical', 'Furniture'],
  'Living Room': ['Walls', 'Ceiling', 'Floor', 'Windows', 'Door', 'Electrical', 'Furniture'],
  'Kitchen':     ['Walls', 'Ceiling', 'Floor', 'Cabinets', 'Countertop', 'Sink', 'Appliances', 'Electrical'],
  'Bathroom':    ['Walls', 'Ceiling', 'Floor', 'Tiles', 'Toilet', 'Sink', 'Shower/Tap', 'Door'],
  'Balcony':     ['Walls', 'Floor', 'Railing', 'Ceiling', 'Door'],
  'Hallway':     ['Walls', 'Ceiling', 'Floor', 'Door', 'Electrical'],
  'Other':       ['Walls', 'Ceiling', 'Floor', 'Fixtures'],
};

export const AVAILABLE_ROOMS = Object.keys(ROOM_AREAS);

export const CATEGORY_LABELS: Record<FindingCategory, string> = {
  structural: 'Structural / Surface',
  electrical: 'Electrical',
  doors_windows: 'Doors & Windows',
  plumbing: 'Plumbing',
  furniture: 'Furniture & Appliances',
};

export const SEVERITY_CONFIG: Record<FindingSeverity, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: 'High',   color: '#F04438', bg: '#FEF3F2', border: '#FECDCA' },
  medium: { label: 'Medium', color: '#F79009', bg: '#FFFAEB', border: '#FEDF89' },
  low:    { label: 'Low',    color: '#667085', bg: '#F7F8FA', border: '#E4E7EC' },
};
