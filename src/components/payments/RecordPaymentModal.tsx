import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  agreementId: string;
  tenantId: string;
  rentAmount: number;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  onSubmit,
  agreementId,
  tenantId,
  rentAmount,
}: RecordPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: rentAmount.toString(),
    dueDate: new Date().toISOString().split('T')[0],
    paidDate: new Date().toISOString().split('T')[0],
    method: 'upi',
    reference: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        agreement_id: agreementId,
        tenant_id: tenantId,
        amount: Number(formData.amount),
        due_date: formData.dueDate,
        paid_date: formData.paidDate,
        status: 'paid',
        payment_method: formData.method,
        reference_number: formData.reference,
        notes: formData.notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount (₹)"
          type="number"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <Input
            label="Paid Date"
            type="date"
            required
            value={formData.paidDate}
            onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Payment Method</label>
          <select
            className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3157FF]/20 focus:border-[#3157FF]"
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
          >
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
        <Input
          label="Transaction Reference"
          placeholder="e.g. UTR number"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
        />
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>Save Payment</Button>
        </div>
      </form>
    </Modal>
  );
}
