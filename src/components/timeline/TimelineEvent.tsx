import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, CreditCard, Wrench, ClipboardCheck, File, MessageSquare } from 'lucide-react';
import type { RentalEvent } from '../../types';
import { Badge } from '../ui/Badge';
import { clsx } from 'clsx';

const getEventConfig = (type: string) => {
  switch (type) {
    case 'agreement': return { icon: FileText, color: 'text-[#3157FF]', bg: 'bg-[#3157FF]/10', border: 'border-[#3157FF]' };
    case 'payment': return { icon: CreditCard, color: 'text-[#12B76A]', bg: 'bg-[#12B76A]/10', border: 'border-[#12B76A]' };
    case 'maintenance': return { icon: Wrench, color: 'text-[#F79009]', bg: 'bg-[#F79009]/10', border: 'border-[#F79009]' };
    case 'inspection': return { icon: ClipboardCheck, color: 'text-[#101828]', bg: 'bg-[#101828]/10', border: 'border-[#101828]' };
    case 'document': return { icon: File, color: 'text-[#3157FF]', bg: 'bg-[#3157FF]/10', border: 'border-[#3157FF]' };
    default: return { icon: MessageSquare, color: 'text-[#667085]', bg: 'bg-[#F7F8FA]', border: 'border-[#667085]' };
  }
};

const getStatusVariant = (status: string): 'success' | 'warning' | 'neutral' => {
  if (status === 'verified' || status === 'paid') return 'success';
  if (status === 'pending') return 'warning';
  return 'neutral';
};

export interface TimelineEventProps {
  event: RentalEvent;
  index: number;
}

export function TimelineEvent({ event, index }: TimelineEventProps) {
  const { icon: Icon, color, bg } = getEventConfig(event.event_type);
  const statusValue = event.metadata?.status as string | undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-10 pb-8 last:pb-0"
    >
      {/* Vertical line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-[#E4E7EC] last:hidden" />

      {/* Icon dot */}
      <div className={clsx('absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border-2 border-white', bg, color)}>
        <Icon size={20} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E4E7EC] p-5 ml-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
          <div>
            <h4 className="text-base font-semibold text-[#111827]">{event.title}</h4>
            {event.description && (
              <p className="text-sm text-[#667085] mt-1">{event.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs font-medium text-[#667085]">
              {format(new Date(event.created_at), 'dd MMM yyyy, hh:mm a')}
            </span>
            {statusValue && (
              <Badge variant={getStatusVariant(statusValue)}>
                {statusValue}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
