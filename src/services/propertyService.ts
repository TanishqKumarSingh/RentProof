import { supabase } from '../lib/supabase';
import { Property, RentalAgreement, DashboardMetrics } from '../types';
import { getPaymentSummary, getPaymentHistory } from './paymentService';
import { getEvents } from './timelineService';

export const getProperty = async (propertyId: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error) throw error;
  return data as Property;
};

export const getAgreement = async (agreementId: string) => {
  const { data, error } = await supabase
    .from('rental_agreements')
    .select('*, property:properties(*), tenant:profiles!rental_agreements_tenant_id_fkey(*), landlord:profiles!rental_agreements_landlord_id_fkey(*)')
    .eq('id', agreementId)
    .single();

  if (error) throw error;
  return data as RentalAgreement;
};

export const getDashboardMetrics = async (agreementId: string, role: 'tenant' | 'landlord'): Promise<DashboardMetrics> => {
  const paymentSummary = await getPaymentSummary(agreementId);
  const paymentHistory = await getPaymentHistory(agreementId);
  const events = await getEvents(agreementId);
  const agreement = await getAgreement(agreementId);
  
  const openIssues = events.filter(e => e.event_type === 'maintenance').length; // Basic logic
  const documentCount = events.filter(e => e.event_type === 'document').length;
  
  // Basic health score logic
  const healthScore = role === 'tenant' 
    ? (paymentSummary.totalOverdue === 0 ? 100 : 70) 
    : (openIssues === 0 ? 100 : 80);

  return {
    monthlyRent: agreement.rent_amount,
    healthScore,
    openIssues,
    documentCount,
    totalPaid: paymentSummary.totalPaid,
    totalPending: paymentSummary.totalPending,
    totalOverdue: paymentSummary.totalOverdue,
    totalVerified: paymentSummary.totalVerified,
    paymentHistory,
  };
};
