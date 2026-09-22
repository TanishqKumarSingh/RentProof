import React from 'react';

export interface PaymentSummaryProps {
  summary: {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    totalVerified: number;
  };
}

export function PaymentSummary({ summary }: PaymentSummaryProps) {
  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const boxes = [
    { label: 'Total Paid', value: formatCurrency(summary.totalPaid), color: 'bg-[#12B76A]' },
    { label: 'Verified', value: formatCurrency(summary.totalVerified), color: 'bg-[#3157FF]' },
    { label: 'Pending', value: formatCurrency(summary.totalPending), color: 'bg-[#F79009]' },
    { label: 'Overdue', value: formatCurrency(summary.totalOverdue), color: 'bg-[#F04438]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {boxes.map((box, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-[#E4E7EC] p-5 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${box.color}`} />
          <p className="text-sm font-medium text-[#667085]">{box.label}</p>
          <h3 className="text-2xl font-bold text-[#111827] mt-1">{box.value}</h3>
        </div>
      ))}
    </div>
  );
}
