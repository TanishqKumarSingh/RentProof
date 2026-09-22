import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wrench, Upload, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Record Payment',
      icon: CreditCard,
      onClick: () => navigate('/payments'),
      color: 'bg-[#12B76A]/10 text-[#12B76A]',
    },
    {
      label: 'View Timeline',
      icon: Clock,
      onClick: () => navigate('/timeline'),
      color: 'bg-[#3157FF]/10 text-[#3157FF]',
    },
    {
      label: 'Report Issue',
      icon: Wrench,
      onClick: () => {},
      color: 'bg-[#F79009]/10 text-[#F79009]',
      comingSoon: true,
    },
    {
      label: 'Upload Document',
      icon: Upload,
      onClick: () => {},
      color: 'bg-[#101828]/10 text-[#101828]',
      comingSoon: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E4E7EC]">
      <h3 className="text-lg font-semibold text-[#111827] mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            disabled={action.comingSoon}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border border-[#E4E7EC] hover:border-[#3157FF] transition-colors relative ${action.comingSoon ? 'opacity-70 cursor-not-allowed hover:border-[#E4E7EC]' : 'cursor-pointer'}`}
          >
            <div className={`p-3 rounded-full mb-3 ${action.color}`}>
              <action.icon size={24} />
            </div>
            <span className="text-sm font-medium text-[#111827] text-center">{action.label}</span>
            {action.comingSoon && (
              <div className="absolute top-2 right-2">
                <Badge variant="warning">Soon</Badge>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
