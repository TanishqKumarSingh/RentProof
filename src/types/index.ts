export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: 'tenant' | 'landlord';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  landlord_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  monthly_rent: number;
  deposit_amount: number;
  amenities: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface RentalAgreement {
  id: string;
  property_id: string;
  tenant_id: string;
  landlord_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_amount: number;
  payment_due_day: number;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  terms: string | null;
  created_at: string;
  updated_at: string;
  property?: Property;
  tenant?: Profile;
  landlord?: Profile;
}

export interface Payment {
  id: string;
  agreement_id: string;
  tenant_id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: 'paid' | 'pending' | 'overdue' | 'verified';
  payment_method: string | null;
  transaction_ref: string | null;
  receipt_url: string | null;
  notes: string | null;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string;
  agreement_id: string;
  reported_by: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  room: string | null;
  photos: string[] | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyInspection {
  id: string;
  agreement_id: string;
  inspector_id: string;
  inspection_type: 'move_in' | 'move_out' | 'routine' | 'special';
  inspection_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'signed_off';
  rooms: Record<string, RoomCondition> | null;
  overall_condition: string | null;
  notes: string | null;
  photos: string[] | null;
  tenant_signed: boolean;
  landlord_signed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomCondition {
  name: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  photos: string[];
}

export interface Document {
  id: string;
  agreement_id: string;
  uploaded_by: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  category: 'agreement' | 'identity' | 'receipt' | 'notice' | 'inspection' | 'general';
  description: string | null;
  created_at: string;
}

export interface Evidence {
  id: string;
  agreement_id: string;
  uploaded_by: string;
  title: string;
  description: string | null;
  evidence_type: 'photo' | 'video' | 'document' | 'screenshot';
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  room: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface RentalEvent {
  id: string;
  agreement_id: string;
  event_type: 'agreement' | 'payment' | 'maintenance' | 'inspection' | 'document' | 'communication' | 'notice' | 'general';
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
  creator?: Profile;
}

export interface Message {
  id: string;
  agreement_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

export type PaymentStatus = Payment['status'];
export type EventType = RentalEvent['event_type'];

export interface DashboardMetrics {
  monthlyRent: number;
  healthScore: number;
  openIssues: number;
  documentCount: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalVerified: number;
  paymentHistory: { month: string; amount: number; status: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
