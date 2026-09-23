/**
 * AI Property Inspection Service
 *
 * Architecture:
 *   inspectionAIService.ts
 *          ↓
 *   Is Vision API configured?
 *      YES ↓          ↓ NO
 *   Gemini Vision    Mock Analysis
 *      ↓                 ↓
 *      └───────┬─────────┘
 *              ↓
 *      Structured Findings
 *
 * To switch from mock to real: only `analyzeRoomImages` needs to change.
 */

import { isGeminiConfigured, getGeminiClient } from '../lib/gemini';
import type {
  AIFinding,
  InspectionRoom,
  InspectionSummary,
  AIInspection,
  DamageComparison,
  FindingCategory,
  FindingSeverity,
  BoundingBox,
} from '../types/inspection';

// ─── Public API ───

/** Returns true if real Gemini Vision analysis is available */
export function isVisionAPIAvailable(): boolean {
  return isGeminiConfigured();
}

/**
 * Analyze images for a single room.
 * If Gemini Vision is configured, uses real multimodal AI.
 * Otherwise falls back to realistic mock analysis.
 */
export async function analyzeRoomImages(
  roomName: string,
  images: { id: string; url: string; area: string }[],
): Promise<AIFinding[]> {
  if (isVisionAPIAvailable()) {
    return analyzeWithGeminiVision(roomName, images);
  }
  return analyzeWithMockEngine(roomName, images);
}

/** Compute a condition score from findings */
export function generateConditionScore(findings: AIFinding[]): number {
  if (findings.length === 0) return 95; // near-perfect if no issues
  const severityPenalty = { high: 12, medium: 5, low: 2 };
  const totalPenalty = findings.reduce(
    (acc, f) => acc + severityPenalty[f.severity] * f.confidence,
    0,
  );
  return Math.max(15, Math.round(100 - totalPenalty));
}

/** Build summary stats from rooms */
export function buildSummary(rooms: InspectionRoom[]): InspectionSummary {
  const allFindings = rooms.flatMap(r => r.findings);
  const inspectedRooms = rooms.filter(r => r.status === 'complete');
  const totalImages = rooms.reduce((a, r) => a + r.images.length, 0);
  return {
    totalIssues: allFindings.length,
    highPriority: allFindings.filter(f => f.severity === 'high').length,
    mediumPriority: allFindings.filter(f => f.severity === 'medium').length,
    lowPriority: allFindings.filter(f => f.severity === 'low').length,
    roomsInspected: inspectedRooms.length,
    totalRooms: rooms.length,
    totalImages,
    completeness: rooms.length > 0 ? Math.round((inspectedRooms.length / rooms.length) * 100) : 0,
  };
}

/** Compare move-in and move-out inspections */
export function compareInspections(
  moveIn: AIInspection,
  moveOut: AIInspection,
): DamageComparison[] {
  const comparisons: DamageComparison[] = [];
  let idx = 0;

  for (const outRoom of moveOut.rooms) {
    const inRoom = moveIn.rooms.find(r => r.name === outRoom.name);

    for (const outFinding of outRoom.findings) {
      const inFinding = inRoom?.findings.find(
        f => f.type === outFinding.type && f.location === outFinding.location,
      );

      let changeType: DamageComparison['changeType'];
      let moveInState: string;

      if (!inFinding) {
        changeType = 'new_damage';
        moveInState = 'No visible damage';
      } else if (outFinding.severity === inFinding.severity) {
        changeType = 'unchanged';
        moveInState = inFinding.description;
      } else if (
        severityRank(outFinding.severity) > severityRank(inFinding.severity)
      ) {
        changeType = 'worsened';
        moveInState = inFinding.description;
      } else {
        changeType = 'existing';
        moveInState = inFinding.description;
      }

      comparisons.push({
        id: `cmp-${++idx}`,
        roomName: outRoom.name,
        findingType: outFinding.type,
        moveInState,
        moveOutState: outFinding.description,
        changeType,
        severity: outFinding.severity,
        confidence: outFinding.confidence,
        moveInImageId: inFinding?.imageId ?? null,
        moveOutImageId: outFinding.imageId,
      });
    }

    // Check for repaired items (in move-in but not in move-out)
    if (inRoom) {
      for (const inFinding of inRoom.findings) {
        const stillExists = outRoom.findings.find(
          f => f.type === inFinding.type && f.location === inFinding.location,
        );
        if (!stillExists) {
          comparisons.push({
            id: `cmp-${++idx}`,
            roomName: outRoom.name,
            findingType: inFinding.type,
            moveInState: inFinding.description,
            moveOutState: 'No longer visible — appears repaired',
            changeType: 'repaired',
            severity: 'low',
            confidence: 0.85,
            moveInImageId: inFinding.imageId,
            moveOutImageId: null,
          });
        }
      }
    }
  }

  return comparisons;
}

// ─── Real Gemini Vision Analysis ───

async function analyzeWithGeminiVision(
  roomName: string,
  images: { id: string; url: string; area: string }[],
): Promise<AIFinding[]> {
  const client = getGeminiClient();
  if (!client) {
    console.log('[RentProof AI] Mode: DEMO');
    console.log('[RentProof AI] Reason: GEMINI_API_KEY not configured. Falling back to mock engine.');
    return analyzeWithMockEngine(roomName, images);
  }

  const allFindings: AIFinding[] = [];

  for (const img of images) {
    try {
      console.log(`\n[RentProof AI] Mode: LIVE`);
      console.log(`[RentProof AI] Image received: yes`);
      
      const imageData = await urlToBase64(img.url);
      if (!imageData) {
        console.warn(`[RentProof AI] Image type: invalid or unreadable. Skipping.`);
        continue;
      }
      
      console.log(`[RentProof AI] Image type: ${imageData.mimeType}`);
      console.log(`[RentProof AI] Sending image to Gemini...`);

      const prompt = `You are RentProof AI, a strict visual inspection assistant analyzing a photograph of a ${roomName} (area: ${img.area}).

CRITICAL INSTRUCTION:
You must ONLY report issues that are CLEARLY VISIBLE in the image. 
If the image shows a clean, undamaged room/item, you MUST return an empty array: []
Do NOT invent damage. Do NOT assume typical issues exist just because of the room type.
Normal furniture, clean walls, and standard fixtures are NOT damage.

Analyze this image for ANY visible property damage or issues including:
- Structural: wall cracks, ceiling cracks, dampness, water stains, peeling paint, broken tiles, damaged flooring, holes
- Electrical: damaged switches, broken sockets, exposed wires, damaged fixtures
- Doors & Windows: broken handles, damaged locks, cracked glass, hinge/frame damage
- Plumbing: visible leaks, water stains, damaged taps, sink/toilet damage
- Furniture: scratches, dents, broken parts, missing components, wear and tear

For EACH visibly detected issue, return a JSON array of objects with these exact fields:
{
  "type": "short name like Wall Crack",
  "category": "structural" | "electrical" | "doors_windows" | "plumbing" | "furniture",
  "severity": "high" | "medium" | "low",
  "confidence": 0.0 to 1.0,
  "location": "specific location like North Wall, Near Door",
  "description": "detailed description of what is actually visible",
  "recommendation": "what should be done",
  "boundingBox": { "x": 0-100, "y": 0-100, "w": 5-50, "h": 5-50 }
}

boundingBox values are PERCENTAGES (0 to 100) of image dimensions. It should tightly bound the damaged area.

If NO significant visible damage is detected, return an empty array: []
Return ONLY the JSON array.`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          prompt,
          { inlineData: { mimeType: imageData.mimeType, data: imageData.base64 } },
        ],
        config: { 
          responseMimeType: 'application/json',
          temperature: 0.1
        },
      });

      const text = response.text || '[]';
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      let parsed = [];
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.warn("[RentProof AI] Failed to parse JSON response:", text);
      }
      
      console.log(`[RentProof AI] Gemini response received`);
      console.log(`[RentProof AI] Findings detected: ${Array.isArray(parsed) ? parsed.length : 0}`);

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          allFindings.push({
            id: `f-${img.id}-${allFindings.length}`,
            category: item.category || 'structural',
            type: item.type || 'Unknown Issue',
            severity: item.severity || 'low',
            confidence: Math.min(1, Math.max(0, item.confidence || 0.5)),
            location: `${roomName} — ${item.location || img.area}`,
            description: item.description || 'Issue detected',
            recommendation: item.recommendation || 'Document and monitor',
            boundingBox: item.boundingBox || { x: 30, y: 30, w: 20, h: 20 },
            imageId: img.id,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error(`[RentProof AI] LIVE Vision API error for image ${img.id}:`, err);
      // DO NOT SILENTLY FALLBACK TO MOCK HERE. 
      // If live AI is failing on this image, we skip or alert, but we do not fake the result.
    }
  }

  return allFindings;
}

async function urlToBase64(
  url: string,
): Promise<{ base64: string; mimeType: string } | null> {
  try {
    if (url.startsWith('data:')) {
      const [header, data] = url.split(',');
      const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/jpeg';
      return { base64: data, mimeType };
    }
    // For blob/object URLs
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const [header, data] = result.split(',');
        const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/jpeg';
        resolve({ base64: data, mimeType });
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── Mock Analysis Engine ───

const MOCK_FINDINGS_DB: Record<string, Record<string, Omit<AIFinding, 'id' | 'imageId' | 'timestamp'>[]>> = {
  Bedroom: {
    Walls: [
      { category: 'structural', type: 'Wall Crack', severity: 'medium', confidence: 0.94, location: 'Bedroom — North Wall', description: 'Visible vertical crack approximately 25–30 cm long running from near the ceiling downward. Appears to be a surface-level crack, not structural.', recommendation: 'Document and inspect for structural significance. Surface repair with filler and repaint.', boundingBox: { x: 62, y: 15, w: 8, h: 35 } },
      { category: 'structural', type: 'Paint Peeling', severity: 'low', confidence: 0.88, location: 'Bedroom — East Wall', description: 'Small area of paint peeling near the window frame, approximately 10×15 cm. Likely caused by moisture condensation.', recommendation: 'Scrape loose paint, apply primer, and repaint the affected area.', boundingBox: { x: 78, y: 42, w: 12, h: 14 } },
    ],
    Ceiling: [
      { category: 'structural', type: 'Water Stain', severity: 'medium', confidence: 0.82, location: 'Bedroom — Ceiling Center', description: 'Brownish discoloration approximately 30 cm diameter on ceiling. Indicates past or ongoing water seepage from above.', recommendation: 'Investigate source of water from upper floor or roof. Repair source before cosmetic fix.', boundingBox: { x: 35, y: 25, w: 25, h: 20 } },
    ],
    Electrical: [
      { category: 'electrical', type: 'Damaged Socket', severity: 'high', confidence: 0.91, location: 'Bedroom — Near Door', description: 'Wall socket has visible crack on the faceplate. One pin slot appears discolored, suggesting heat damage or arcing.', recommendation: 'Replace the socket immediately. Have an electrician inspect the wiring behind the socket.', boundingBox: { x: 15, y: 55, w: 10, h: 12 } },
    ],
    Furniture: [
      { category: 'furniture', type: 'Surface Scratch', severity: 'low', confidence: 0.79, location: 'Bedroom — Desk', description: 'Multiple light scratches visible on desk surface, approximately 15–20 cm long. Consistent with normal use and wear.', recommendation: 'Document for move-in record. Minor cosmetic damage, does not affect function.', boundingBox: { x: 20, y: 60, w: 30, h: 15 } },
    ],
  },
  Kitchen: {
    Walls: [
      { category: 'structural', type: 'Wall Staining', severity: 'low', confidence: 0.85, location: 'Kitchen — Behind Stove', description: 'Grease and heat discoloration on the wall behind the cooking area. Approximately 40×30 cm area.', recommendation: 'Deep clean with degreaser. Repaint if staining persists.', boundingBox: { x: 30, y: 35, w: 25, h: 20 } },
    ],
    Cabinets: [
      { category: 'furniture', type: 'Cabinet Damage', severity: 'medium', confidence: 0.87, location: 'Kitchen — Upper Cabinet', description: 'Cabinet door hinge appears loose, causing the door to hang slightly misaligned. Laminate peeling on bottom edge.', recommendation: 'Tighten or replace hinge. Re-glue laminate edge.', boundingBox: { x: 55, y: 10, w: 20, h: 25 } },
    ],
    Sink: [
      { category: 'plumbing', type: 'Tap Dripping', severity: 'medium', confidence: 0.76, location: 'Kitchen — Sink', description: 'Possible slow drip visible at the base of the kitchen tap. Water marks around the tap base suggest ongoing minor leakage.', recommendation: 'Replace tap washer or cartridge. Check for corrosion underneath.', boundingBox: { x: 40, y: 50, w: 15, h: 18 } },
    ],
  },
  Bathroom: {
    Tiles: [
      { category: 'structural', type: 'Tile Damage', severity: 'medium', confidence: 0.89, location: 'Bathroom — Floor Tiles', description: 'One floor tile shows a visible crack running diagonally. Adjacent tile has minor chipping at the edge.', recommendation: 'Replace cracked tile. Seal chip to prevent water ingress.', boundingBox: { x: 25, y: 70, w: 18, h: 15 } },
    ],
    'Shower/Tap': [
      { category: 'plumbing', type: 'Water Leakage', severity: 'high', confidence: 0.92, location: 'Bathroom — Shower Area', description: 'Visible water seepage at the junction between the shower wall and floor. Water staining and discoloration indicates ongoing leakage.', recommendation: 'Reseal the junction urgently. Check for water damage to underlying structure.', boundingBox: { x: 15, y: 60, w: 22, h: 25 } },
    ],
    Walls: [
      { category: 'structural', type: 'Dampness', severity: 'low', confidence: 0.71, location: 'Bathroom — Lower Wall', description: 'Possible dampness visible on lower section of bathroom wall. Surface appears slightly discolored. Image quality makes it difficult to assess definitively.', recommendation: 'Monitor over time. Check waterproofing if dampness worsens.', boundingBox: { x: 50, y: 65, w: 20, h: 20 } },
    ],
  },
  'Living Room': {
    Walls: [
      { category: 'structural', type: 'Paint Damage', severity: 'low', confidence: 0.83, location: 'Living Room — Near Window', description: 'Minor paint bubbling near window frame, approximately 8 cm area. Likely caused by monsoon moisture.', recommendation: 'Scrape, prime, and repaint. Improve ventilation near window.', boundingBox: { x: 72, y: 30, w: 10, h: 12 } },
    ],
    Floor: [],
    Electrical: [],
  },
  Balcony: {
    Walls: [],
    Railing: [
      { category: 'structural', type: 'Railing Rust', severity: 'low', confidence: 0.86, location: 'Balcony — Railing', description: 'Surface rust visible on metal railing at two points. Does not appear to compromise structural integrity.', recommendation: 'Sand rust spots and apply anti-rust primer and paint.', boundingBox: { x: 10, y: 45, w: 35, h: 10 } },
    ],
  },
};

function generateMockFindingsForImage(
  roomName: string,
  image: { id: string; area: string },
): AIFinding[] {
  const roomData = MOCK_FINDINGS_DB[roomName];
  if (!roomData) return [];

  const areaFindings = roomData[image.area];
  if (!areaFindings || areaFindings.length === 0) return [];

  return areaFindings.map((f, i) => ({
    ...f,
    id: `f-${image.id}-${i}`,
    imageId: image.id,
    timestamp: new Date().toISOString(),
  }));
}

async function analyzeWithMockEngine(
  roomName: string,
  images: { id: string; url: string; area: string }[],
): Promise<AIFinding[]> {
  // Simulate AI processing delay (300–800ms per image)
  await new Promise(r => setTimeout(r, images.length * 400 + Math.random() * 500));

  const findings: AIFinding[] = [];
  for (const img of images) {
    findings.push(...generateMockFindingsForImage(roomName, img));
  }
  return findings;
}

// ─── Helpers ───

function severityRank(s: FindingSeverity): number {
  return s === 'high' ? 3 : s === 'medium' ? 2 : 1;
}
