import { supabase } from '../lib/supabase';
import { Payment } from '../types';

export const getPayments = async (agreementId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('agreement_id', agreementId)
    .order('due_date', { ascending: false });
  if (error) throw error;
  return data as Payment[];
};

export const getPaymentSummary = async (agreementId: string) => {
  const payments = await getPayments(agreementId);
  return payments.reduce(
    (acc, p) => {
      if (p.status === 'paid') acc.totalPaid += p.amount;
      if (p.status === 'pending') acc.totalPending += p.amount;
      if (p.status === 'overdue') acc.totalOverdue += p.amount;
      if (p.status === 'verified') acc.totalVerified += p.amount;
      return acc;
    },
    { totalPaid: 0, totalPending: 0, totalOverdue: 0, totalVerified: 0 }
  );
};

export const recordPayment = async (data: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'verified_at' | 'verified_by'>) => {
  const { data: payment, error } = await supabase
    .from('payments')
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('rental_events').insert({
    agreement_id: data.agreement_id,
    event_type: 'payment',
    title: 'Payment Recorded',
    description: `A payment of ₹${data.amount} was recorded.`,
    created_by: data.tenant_id,
  });

  return payment;
};

export const verifyPayment = async (paymentId: string, verifiedBy: string) => {
  const { data, error } = await supabase
    .from('payments')
    .update({ 
      status: 'verified',
      verified_at: new Date().toISOString(),
      verified_by: verifiedBy
    })
    .eq('id', paymentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const uploadReceipt = async (paymentId: string, file: File) => {
  const fileName = `${paymentId}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('payment-receipts')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('payment-receipts')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('payments')
    .update({ receipt_url: publicUrl })
    .eq('id', paymentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPaymentHistory = async (agreementId: string, months: number = 6) => {
  const payments = await getPayments(agreementId);
  const history = payments.slice(0, months).map(p => ({
    month: new Date(p.due_date).toLocaleString('default', { month: 'short' }),
    amount: p.amount,
    status: p.status,
  })).reverse();
  return history;
};
