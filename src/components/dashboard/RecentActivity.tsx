import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FileText, CreditCard, Wrench, ClipboardCheck, File, MessageSquare, ChevronRight } from 'lucide-react';
import { RentalEvent } from '../../types';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';

const getEventIcon = (type: string) => {
  switch (type) {
    case 'agreement': return { icon: FileText, color: 'text-[#3157FF]', bg: 'bg-[#3157FF]/10' };
    case 'payment': return { icon: CreditCard, color: 'text-[#12B76A]', bg: 'bg-[#12B76A]/10' };
    case 'maintenance': return { icon: Wrench, color: 'text-[#F79009]', bg: 'bg-[#F79009]/10' };
    case 'inspection': return { icon: ClipboardCheck, color: 'text-[#101828]', bg: 'bg-[#101828]/10' };
    case 'document': return { icon: File, color: 'text-[#3157FF]', bg: 'bg-[#3157FF]/10' };
    default: return { icon: MessageSquare, color: 'text-[#667085]', bg: 'bg-[#F7F8FA]' };
  }
};

export interface RecentActivityProps {
  events: RentalEvent[];
  loading: boolean;
}

export function RecentActivity({ events, loading }: RecentActivityProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E4E7EC]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#111827]">Recent Activity</h3>
        <button
          onClick={() => navigate('/timeline')}
          className="text-sm font-medium text-[#3157FF] flex items-center hover:underline"
        >
          View All <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="md" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="Your timeline is quiet right now."
          icon={<FileText size={24} />}
        />
      ) : (
        <div className="space-y-6">
          {events.slice(0, 5).map((event) => {
            const { icon: Icon, color, bg } = getEventIcon(event.event_type);
            return (
              <div key={event.id} className="flex gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bg} ${color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{event.title}</p>
                  <p className="text-xs text-[#667085] truncate">{formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
