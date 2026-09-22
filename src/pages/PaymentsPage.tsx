import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPayments, getPaymentSummary, recordPayment, verifyPayment } from '../services/paymentService';
import { Payment } from '../types';
import { PaymentRow } from '../components/payments/PaymentRow';
import { PaymentSummary } from '../components/payments/PaymentSummary';
import { RecordPaymentModal } from '../components/payments/RecordPaymentModal';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { CreditCard, Plus } from 'lucide-react';

export default function PaymentsPage() {
  const { agreement, profile, isLandlord } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    if (!agreement?.id) return;
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        getPayments(agreement.id),
        getPaymentSummary(agreement.id)
      ]);
      setPayments(p.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime()));
      setSummary(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [agreement]);

  const handleRecordPayment = async (data: any) => {
    await recordPayment(data);
    await loadData();
  };

  const handleVerify = async (paymentId: string) => {
    if (!profile) return;
    await verifyPayment(paymentId, profile.id);
    await loadData();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Payment Hub</h1>
          <p className="text-[#667085] mt-1">Manage and track all your rent payments.</p>
        </div>
        {!isLandlord && (
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} /> Record Payment
          </Button>
        )}
      </div>

      {summary && <PaymentSummary summary={summary} />}

      <div className="bg-white rounded-xl shadow-sm border border-[#E4E7EC] overflow-hidden">
        <div className="p-5 border-b border-[#E4E7EC] bg-[#F7F8FA]">
          <h3 className="font-semibold text-[#111827]">Payment Ledger</h3>
        </div>
        
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <Spinner size="md" />
            </div>
          ) : payments.length === 0 ? (
            <EmptyState
              icon={<CreditCard size={48} />}
              title="No payments yet"
              description="Record your first payment to start building trust."
            />
          ) : (
            payments.map(payment => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                isLandlord={!!isLandlord}
                onVerify={handleVerify}
              />
            ))
          )}
        </div>
      </div>

      {agreement && profile && (
        <RecordPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleRecordPayment}
          agreementId={agreement.id}
          tenantId={profile.id}
          rentAmount={agreement.rent_amount}
        />
      )}
    </div>
  );
}
