import { Profile, Property, RentalAgreement, Payment, RentalEvent, DashboardMetrics, MaintenanceRequest, PropertyInspection, Document, Evidence } from '../types';

// ─── Demo Profiles ───
export const DEMO_TENANT: Profile = {
  id: 'demo-tenant-001',
  full_name: 'Aarav Sharma',
  email: 'tenant@rentproof.demo',
  phone: '+91 91234 56789',
  role: 'tenant',
  avatar_url: null,
  created_at: '2025-10-01T00:00:00Z',
  updated_at: '2025-10-01T00:00:00Z',
};

export const DEMO_LANDLORD: Profile = {
  id: 'demo-landlord-001',
  full_name: 'Rahul Mehta',
  email: 'landlord@rentproof.demo',
  phone: '+91 98765 43210',
  role: 'landlord',
  avatar_url: null,
  created_at: '2025-10-01T00:00:00Z',
  updated_at: '2025-10-01T00:00:00Z',
};

// ─── Demo Property ───
export const DEMO_PROPERTY: Property = {
  id: 'demo-property-001',
  landlord_id: DEMO_LANDLORD.id,
  name: 'Sunrise Residency, Flat B-402',
  address: 'Sector 10, Indirapuram',
  city: 'Ghaziabad',
  state: 'Uttar Pradesh',
  pincode: '201014',
  property_type: 'Apartment',
  bedrooms: 2,
  bathrooms: 2,
  area_sqft: 1050,
  monthly_rent: 18000,
  deposit_amount: 36000,
  amenities: ['parking', 'gym', 'pool', 'security'],
  created_at: '2025-10-01T00:00:00Z',
  updated_at: '2025-10-01T00:00:00Z',
};

// ─── Demo Agreement ───
export const DEMO_AGREEMENT: RentalAgreement = {
  id: 'demo-agreement-001',
  property_id: DEMO_PROPERTY.id,
  tenant_id: DEMO_TENANT.id,
  landlord_id: DEMO_LANDLORD.id,
  start_date: '2025-10-01',
  end_date: '2026-09-30',
  rent_amount: 18000,
  deposit_amount: 36000,
  payment_due_day: 1,
  status: 'active',
  terms: 'Standard 11 month rental agreement. 1 month notice period.',
  created_at: '2025-10-01T00:00:00Z',
  updated_at: '2025-10-01T00:00:00Z',
  property: DEMO_PROPERTY,
  tenant: DEMO_TENANT,
  landlord: DEMO_LANDLORD,
};

// ─── Demo Payments ───
const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const years =  [2025,  2025,  2025,  2026,  2026,  2026,  2026,  2026,  2026,  2026,  2026,  2026];

export const DEMO_PAYMENTS: Payment[] = months.map((m, i) => {
  const y = years[i];
  const monthNum = String(((i + 9) % 12) + 1).padStart(2, '0');
  const dueDate = `${y}-${monthNum}-01`;
  
  let status: Payment['status'];
  let paidDate: string | null = null;
  let verifiedAt: string | null = null;
  let verifiedBy: string | null = null;

  if (i < 10) {
    status = 'verified';
    paidDate = `${y}-${monthNum}-0${(i % 3) + 1}`;
    verifiedAt = `${y}-${monthNum}-0${(i % 3) + 2}`;
    verifiedBy = DEMO_LANDLORD.id;
  } else if (i === 10) {
    status = 'paid';
    paidDate = `${y}-${monthNum}-02`;
  } else {
    status = 'pending';
  }

  return {
    id: `demo-payment-${String(i + 1).padStart(3, '0')}`,
    agreement_id: DEMO_AGREEMENT.id,
    tenant_id: DEMO_TENANT.id,
    amount: 18000,
    due_date: dueDate,
    paid_date: paidDate,
    status,
    payment_method: status !== 'pending' ? 'UPI' : null,
    transaction_ref: status !== 'pending' ? `TXN${1001 + i}` : null,
    receipt_url: null,
    notes: null,
    verified_at: verifiedAt,
    verified_by: verifiedBy,
    created_at: dueDate + 'T00:00:00Z',
    updated_at: dueDate + 'T00:00:00Z',
  };
});

// ─── Demo Events ───
export const DEMO_EVENTS: RentalEvent[] = [
  { id: 'evt-01', agreement_id: DEMO_AGREEMENT.id, event_type: 'agreement',   title: 'Agreement Signed',             description: 'Digital rental agreement signed by both parties.',          metadata: null, created_by: DEMO_LANDLORD.id, created_at: '2025-10-01T10:00:00Z' },
  { id: 'evt-02', agreement_id: DEMO_AGREEMENT.id, event_type: 'payment',     title: 'Security Deposit Paid',        description: '₹36,000 paid as security deposit via Bank Transfer.',       metadata: null, created_by: DEMO_TENANT.id,   created_at: '2025-10-01T12:00:00Z' },
  { id: 'evt-03', agreement_id: DEMO_AGREEMENT.id, event_type: 'inspection',  title: 'Move-in Inspection',           description: 'Initial property inspection completed. All rooms OK.',      metadata: null, created_by: DEMO_LANDLORD.id, created_at: '2025-10-02T09:00:00Z' },
  { id: 'evt-04', agreement_id: DEMO_AGREEMENT.id, event_type: 'document',    title: 'Identity Documents Uploaded',  description: 'Tenant uploaded Aadhar and PAN cards.',                     metadata: null, created_by: DEMO_TENANT.id,   created_at: '2025-10-03T11:00:00Z' },
  { id: 'evt-05', agreement_id: DEMO_AGREEMENT.id, event_type: 'payment',     title: 'Rent Payment - Oct 2025',      description: 'Rent of ₹18,000 paid and verified via UPI.',                metadata: null, created_by: DEMO_TENANT.id,   created_at: '2025-10-01T14:00:00Z' },
  { id: 'evt-06', agreement_id: DEMO_AGREEMENT.id, event_type: 'payment',     title: 'Rent Payment - Nov 2025',      description: 'Rent of ₹18,000 paid and verified via UPI.',                metadata: null, created_by: DEMO_TENANT.id,   created_at: '2025-11-02T10:00:00Z' },
  { id: 'evt-07', agreement_id: DEMO_AGREEMENT.id, event_type: 'payment',     title: 'Rent Payment - Dec 2025',      description: 'Rent of ₹18,000 paid and verified via UPI.',                metadata: null, created_by: DEMO_TENANT.id,   created_at: '2025-12-01T10:00:00Z' },
  { id: 'evt-08', agreement_id: DEMO_AGREEMENT.id, event_type: 'maintenance', title: 'Leaking Tap in Kitchen',       description: 'Tenant reported a leaking tap in the kitchen sink.',        metadata: null, created_by: DEMO_TENANT.id,   created_at: '2025-12-15T08:00:00Z' },
  { id: 'evt-09', agreement_id: DEMO_AGREEMENT.id, event_type: 'maintenance', title: 'Leaking Tap Fixed',            description: 'Plumber visited and fixed the tap issue.',                  metadata: null, created_by: DEMO_LANDLORD.id, created_at: '2025-12-18T16:00:00Z' },
  { id: 'evt-10', agreement_id: DEMO_AGREEMENT.id, event_type: 'payment',     title: 'Rent Payment - Jan 2026',      description: 'Rent of ₹18,000 paid and verified.',                        metadata: null, created_by: DEMO_TENANT.id,   created_at: '2026-01-03T10:00:00Z' },
  { id: 'evt-11', agreement_id: DEMO_AGREEMENT.id, event_type: 'inspection',  title: 'Routine Inspection - 6 Months', description: 'Mid-term inspection completed, no issues found.',          metadata: null, created_by: DEMO_LANDLORD.id, created_at: '2026-03-15T11:00:00Z' },
  { id: 'evt-12', agreement_id: DEMO_AGREEMENT.id, event_type: 'payment',     title: 'Rent Payment - Aug 2026',      description: 'Rent of ₹18,000 paid. Awaiting landlord verification.',     metadata: null, created_by: DEMO_TENANT.id,   created_at: '2026-08-02T09:00:00Z' },
  { id: 'evt-13', agreement_id: DEMO_AGREEMENT.id, event_type: 'payment',     title: 'Rent Payment - Sep 2026',      description: 'Rent of ₹18,000 due. Payment pending.',                     metadata: { status: 'pending' }, created_by: null, created_at: '2026-09-01T00:00:00Z' },
];

// ─── Demo Dashboard Metrics ───
export const getDemoMetrics = (role: 'tenant' | 'landlord'): DashboardMetrics => ({
  monthlyRent: 18000,
  healthScore: role === 'tenant' ? 87 : 92,
  openIssues: 2,
  documentCount: 8,
  totalPaid: 10 * 18000,
  totalPending: 18000,
  totalOverdue: 0,
  totalVerified: 10 * 18000,
  paymentHistory: [
    { month: 'Apr', amount: 18000, status: 'verified' },
    { month: 'May', amount: 18000, status: 'verified' },
    { month: 'Jun', amount: 18000, status: 'verified' },
    { month: 'Jul', amount: 18000, status: 'verified' },
    { month: 'Aug', amount: 18000, status: 'paid' },
    { month: 'Sep', amount: 18000, status: 'pending' },
  ],
});

// ─── Payment Summary ───
export const getDemoPaymentSummary = () => ({
  totalPaid: 10 * 18000,
  totalPending: 18000,
  totalOverdue: 0,
  totalVerified: 10 * 18000,
});

// ─── Demo Maintenance Requests ───
export const DEMO_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'maint-001',
    agreement_id: DEMO_AGREEMENT.id,
    reported_by: DEMO_TENANT.id,
    title: 'Leaking Tap in Kitchen',
    description: 'The kitchen sink tap has been dripping constantly for 2 days. Water is pooling under the sink cabinet. Needs urgent plumber visit.',
    category: 'Plumbing',
    priority: 'high',
    status: 'resolved',
    room: 'Kitchen',
    photos: null,
    resolved_at: '2025-12-18T16:00:00Z',
    created_at: '2025-12-15T08:30:00Z',
    updated_at: '2025-12-18T16:00:00Z',
  },
  {
    id: 'maint-002',
    agreement_id: DEMO_AGREEMENT.id,
    reported_by: DEMO_TENANT.id,
    title: 'AC Not Cooling in Bedroom',
    description: 'The split AC in the master bedroom is running but not cooling. Temperature stays at 30°C even after running for 2 hours. Possibly low gas or compressor issue.',
    category: 'Electrical',
    priority: 'high',
    status: 'in_progress',
    room: 'Master Bedroom',
    photos: null,
    resolved_at: null,
    created_at: '2026-09-10T09:15:00Z',
    updated_at: '2026-09-12T11:00:00Z',
  },
  {
    id: 'maint-003',
    agreement_id: DEMO_AGREEMENT.id,
    reported_by: DEMO_TENANT.id,
    title: 'Bathroom Door Lock Stuck',
    description: 'The lock on the guest bathroom door gets stuck when trying to lock from inside. Have to push hard to turn the latch. Safety concern.',
    category: 'Carpentry',
    priority: 'medium',
    status: 'acknowledged',
    room: 'Guest Bathroom',
    photos: null,
    resolved_at: null,
    created_at: '2026-09-18T14:00:00Z',
    updated_at: '2026-09-19T10:00:00Z',
  },
  {
    id: 'maint-004',
    agreement_id: DEMO_AGREEMENT.id,
    reported_by: DEMO_TENANT.id,
    title: 'Wall Paint Peeling Near Window',
    description: 'Paint is peeling off the wall near the living room window. Likely due to last monsoon moisture seepage. Patch of about 2x2 feet affected.',
    category: 'General',
    priority: 'low',
    status: 'reported',
    room: 'Living Room',
    photos: null,
    resolved_at: null,
    created_at: '2026-09-20T17:30:00Z',
    updated_at: '2026-09-20T17:30:00Z',
  },
  {
    id: 'maint-005',
    agreement_id: DEMO_AGREEMENT.id,
    reported_by: DEMO_TENANT.id,
    title: 'Exhaust Fan Making Noise',
    description: 'The exhaust fan in the kitchen makes a loud grinding noise when turned on. Bearings seem worn out.',
    category: 'Electrical',
    priority: 'low',
    status: 'closed',
    room: 'Kitchen',
    photos: null,
    resolved_at: '2026-06-10T14:00:00Z',
    created_at: '2026-06-05T11:00:00Z',
    updated_at: '2026-06-10T14:00:00Z',
  },
];

// ─── Demo Inspections ───
export const DEMO_INSPECTIONS: PropertyInspection[] = [
  {
    id: 'insp-001',
    agreement_id: DEMO_AGREEMENT.id,
    inspector_id: DEMO_LANDLORD.id,
    inspection_type: 'move_in',
    inspection_date: '2025-10-02',
    status: 'signed_off',
    rooms: {
      'Living Room': { name: 'Living Room', condition: 'excellent', notes: 'Freshly painted walls, clean flooring.', photos: [] },
      'Master Bedroom': { name: 'Master Bedroom', condition: 'good', notes: 'Minor scuff on wardrobe door.', photos: [] },
      'Kitchen': { name: 'Kitchen', condition: 'excellent', notes: 'All appliances working. New gas connection.', photos: [] },
      'Bathroom': { name: 'Bathroom', condition: 'good', notes: 'Tiles intact. Minor stain near drain.', photos: [] },
    },
    overall_condition: 'Good — property is well maintained with minor cosmetic wear.',
    notes: 'Move-in inspection completed with tenant present. All keys handed over.',
    photos: null,
    tenant_signed: true,
    landlord_signed: true,
    created_at: '2025-10-02T09:00:00Z',
    updated_at: '2025-10-02T11:00:00Z',
  },
  {
    id: 'insp-002',
    agreement_id: DEMO_AGREEMENT.id,
    inspector_id: DEMO_LANDLORD.id,
    inspection_type: 'routine',
    inspection_date: '2026-03-15',
    status: 'completed',
    rooms: {
      'Living Room': { name: 'Living Room', condition: 'good', notes: 'Walls still in good condition.', photos: [] },
      'Master Bedroom': { name: 'Master Bedroom', condition: 'good', notes: 'Wardrobe scuff unchanged.', photos: [] },
      'Kitchen': { name: 'Kitchen', condition: 'fair', notes: 'Grease buildup near exhaust. Tap replaced after earlier leak.', photos: [] },
      'Bathroom': { name: 'Bathroom', condition: 'good', notes: 'No new damage observed.', photos: [] },
    },
    overall_condition: 'Good — routine wear, kitchen needs deep clean.',
    notes: '6 month routine inspection. No major issues found.',
    photos: null,
    tenant_signed: true,
    landlord_signed: true,
    created_at: '2026-03-15T11:00:00Z',
    updated_at: '2026-03-15T13:00:00Z',
  },
  {
    id: 'insp-003',
    agreement_id: DEMO_AGREEMENT.id,
    inspector_id: DEMO_LANDLORD.id,
    inspection_type: 'move_out',
    inspection_date: '2026-09-30',
    status: 'scheduled',
    rooms: null,
    overall_condition: null,
    notes: 'Scheduled for lease end date.',
    photos: null,
    tenant_signed: false,
    landlord_signed: false,
    created_at: '2026-09-20T10:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
];

// ─── Demo Documents ───
export const DEMO_DOCUMENTS: Document[] = [
  { id: 'doc-001', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, name: 'Rental Agreement - Signed Copy.pdf', file_url: '#', file_type: 'application/pdf', file_size: 245000, category: 'agreement', description: 'Signed rental agreement for Flat B-402, Oct 2025 – Sep 2026.', created_at: '2025-10-01T10:00:00Z' },
  { id: 'doc-002', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_TENANT.id,   name: 'Aarav Sharma - Aadhar Card.pdf',   file_url: '#', file_type: 'application/pdf', file_size: 180000, category: 'identity',  description: 'Tenant Aadhar card for KYC.',                       created_at: '2025-10-03T11:00:00Z' },
  { id: 'doc-003', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_TENANT.id,   name: 'Aarav Sharma - PAN Card.pdf',      file_url: '#', file_type: 'application/pdf', file_size: 120000, category: 'identity',  description: 'Tenant PAN card for KYC.',                          created_at: '2025-10-03T11:05:00Z' },
  { id: 'doc-004', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, name: 'Property Tax Receipt 2025-26.pdf', file_url: '#', file_type: 'application/pdf', file_size: 310000, category: 'receipt',   description: 'Municipal property tax receipt.',                    created_at: '2025-11-15T09:00:00Z' },
  { id: 'doc-005', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_TENANT.id,   name: 'Rent Receipt - Oct 2025.pdf',      file_url: '#', file_type: 'application/pdf', file_size: 95000,  category: 'receipt',   description: 'Official rent receipt for October 2025.',           created_at: '2025-10-05T14:00:00Z' },
  { id: 'doc-006', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, name: 'Move-in Inspection Report.pdf',    file_url: '#', file_type: 'application/pdf', file_size: 520000, category: 'inspection', description: 'Detailed move-in condition report with photos.',    created_at: '2025-10-02T15:00:00Z' },
  { id: 'doc-007', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, name: 'Society NOC Letter.pdf',           file_url: '#', file_type: 'application/pdf', file_size: 75000,  category: 'general',   description: 'No-objection certificate from housing society.',    created_at: '2025-10-01T09:00:00Z' },
  { id: 'doc-008', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_TENANT.id,   name: 'Police Verification Form.pdf',     file_url: '#', file_type: 'application/pdf', file_size: 140000, category: 'general',   description: 'Police verification form submitted to local PS.',   created_at: '2025-10-10T10:00:00Z' },
];

// ─── Demo Evidence ───
export const DEMO_EVIDENCE: Evidence[] = [
  { id: 'evi-001', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, title: 'Living Room - Move-in',           description: 'Living room condition at move-in. Clean walls, no damage.',   evidence_type: 'photo', file_url: '#', file_type: 'image/jpeg', file_size: 2400000, room: 'Living Room',     tags: ['move-in', 'walls'],     metadata: null, created_at: '2025-10-02T09:15:00Z' },
  { id: 'evi-002', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, title: 'Kitchen - Move-in',               description: 'Kitchen countertop and appliances at move-in.',               evidence_type: 'photo', file_url: '#', file_type: 'image/jpeg', file_size: 1800000, room: 'Kitchen',         tags: ['move-in', 'appliances'], metadata: null, created_at: '2025-10-02T09:20:00Z' },
  { id: 'evi-003', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, title: 'Master Bedroom - Move-in',        description: 'Master bedroom with wardrobe and AC unit.',                   evidence_type: 'photo', file_url: '#', file_type: 'image/jpeg', file_size: 2100000, room: 'Master Bedroom',  tags: ['move-in', 'wardrobe'],   metadata: null, created_at: '2025-10-02T09:25:00Z' },
  { id: 'evi-004', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_TENANT.id,   title: 'Kitchen Tap Leak',                description: 'Photo of leaking kitchen tap before repair.',                 evidence_type: 'photo', file_url: '#', file_type: 'image/jpeg', file_size: 1500000, room: 'Kitchen',         tags: ['maintenance', 'plumbing'], metadata: null, created_at: '2025-12-15T08:35:00Z' },
  { id: 'evi-005', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_LANDLORD.id, title: 'Kitchen Tap - After Repair',      description: 'New tap installed. No more leakage.',                         evidence_type: 'photo', file_url: '#', file_type: 'image/jpeg', file_size: 1200000, room: 'Kitchen',         tags: ['maintenance', 'resolved'], metadata: null, created_at: '2025-12-18T16:10:00Z' },
  { id: 'evi-006', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_TENANT.id,   title: 'Wall Paint Peeling',              description: 'Peeling paint near living room window post-monsoon.',         evidence_type: 'photo', file_url: '#', file_type: 'image/jpeg', file_size: 1900000, room: 'Living Room',     tags: ['damage', 'monsoon'],     metadata: null, created_at: '2026-09-20T17:35:00Z' },
  { id: 'evi-007', agreement_id: DEMO_AGREEMENT.id, uploaded_by: DEMO_TENANT.id,   title: 'AC Unit - Not Cooling',           description: 'Screenshot of AC remote showing 18°C but room is 30°C.',      evidence_type: 'screenshot', file_url: '#', file_type: 'image/png', file_size: 800000, room: 'Master Bedroom', tags: ['maintenance', 'electrical'], metadata: null, created_at: '2026-09-10T09:20:00Z' },
];

// ─── Demo AI responses ───
export const DEMO_AI_RESPONSES: Record<string, string> = {
  'show unpaid rent': `Based on your rental records:\n\n• **September 2026**: ₹18,000 — **Pending** (due Sep 1)\n\nAll other months from Oct 2025 to Aug 2026 are paid and verified. Your total unpaid balance is **₹18,000**.`,
  'payment summary': `Here's your payment summary for Flat B-402:\n\n📊 **Payment Overview**\n• Total Rent Paid: ₹1,98,000 (11 months)\n• Verified by Landlord: ₹1,80,000 (10 months)\n• Awaiting Verification: ₹18,000 (Aug 2026)\n• Pending Payment: ₹18,000 (Sep 2026)\n• Security Deposit: ₹36,000\n\n✅ Your payment track record is excellent — 100% on-time payments!`,
  'what is my deposit?': `Your security deposit for Flat B-402, Sunrise Residency is **₹36,000** (equal to 2 months' rent).\n\nThis was paid at the start of the lease on **1 Oct 2025** via Bank Transfer. As per your agreement, it will be refunded within 30 days of move-out after deducting any damages found during the move-out inspection.`,
  'lease end date': `Your lease for Flat B-402 at Sunrise Residency, Indirapuram ends on **30 September 2026**.\n\n⏰ That's coming up! Here's what to keep in mind:\n• Notice period: 1 month\n• Move-out inspection: Scheduled for Sep 30\n• Deposit refund: Within 30 days after inspection\n\nWould you like me to help you prepare for the move-out?`,
  'default': `I can help you with your rental at **Flat B-402, Sunrise Residency**, Indirapuram.\n\nHere's what I can answer:\n• 💰 Payment status and history\n• 📋 Lease details and dates\n• 🔧 Maintenance request updates\n• 📄 Document information\n• 🏠 Property details\n\nTry asking "Show unpaid rent" or "Payment summary"!`,
};
