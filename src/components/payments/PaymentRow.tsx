import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Receipt, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Payment } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface PaymentRowProps {
  payment: Payment;
  isLandlord: boolean;
  onVerify?: (paymentId: string) => void;
}

export function PaymentRow({ payment, isLandlord, onVerify }: PaymentRowProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified': return { icon: CheckCircle, variant: 'info' as const, label: 'Verified' };
      case 'paid': return { icon: CheckCircle, variant: 'success' as const, label: 'Paid' };
      case 'pending': return { icon: Clock, variant: 'warning' as const, label: 'Pending' };
      case 'overdue': return { icon: AlertCircle, variant: 'danger' as const, label: 'Overdue' };
      default: return { icon: Clock, variant: 'neutral' as const, label: status };
    }
  };

  const { icon: StatusIcon, variant, label } = getStatusConfig(payment.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-xl border border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#3157FF] transition-colors"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="bg-[#F7F8FA] p-3 rounded-lg text-center min-w-[80px]">
          <span className="block text-xs font-semibold text-[#667085] uppercase">
            {format(new Date(payment.due_date), 'MMM')}
          </span>
          <span className="block text-lg font-bold text-[#111827]">
            {format(new Date(payment.due_date), 'yyyy')}
          </span>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-[#111827]">₹{payment.amount.toLocaleString('en-IN')}</h4>
          <div className="flex items-center gap-3 text-sm text-[#667085] mt-1">
            <span>Due: {format(new Date(payment.due_date), 'dd MMM yyyy')}</span>
            {payment.paid_date && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#E4E7EC]" />
                <span>Paid: {format(new Date(payment.paid_date), 'dd MMM yyyy')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:justify-end">
        <div className="flex flex-col items-end gap-2">
          <Badge variant={variant} className="flex items-center gap-1 px-3 py-1">
            <StatusIcon size={14} /> {label}
          </Badge>
          <span className="text-xs font-medium text-[#667085] capitalize">
            {payment.payment_method?.replace('_', ' ') || 'Not specified'}
          </span>
        </div>

        {payment.receipt_url && (
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.open(payment.receipt_url ?? undefined, '_blank')}>
            <Receipt size={16} />
          </Button>
        )}

        {isLandlord && payment.status === 'paid' && onVerify && (
          <Button variant="primary" size="sm" onClick={() => onVerify(payment.id)}>
            Verify
          </Button>
        )}
      </div>
    </motion.div>
  );
}
