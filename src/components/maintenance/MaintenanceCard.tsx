import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, AlertTriangle, CheckCircle2, Wrench, Eye, ChevronRight } from 'lucide-react';
import { MaintenanceRequest } from '../../types';
import { Badge } from '../ui/Badge';

interface MaintenanceCardProps {
  request: MaintenanceRequest;
  isLandlord: boolean;
  onUpdateStatus?: (id: string, status: MaintenanceRequest['status']) => void;
  index: number;
}

const statusConfig: Record<MaintenanceRequest['status'], { label: string; variant: 'danger' | 'warning' | 'info' | 'success' | 'neutral'; icon: React.ElementType }> = {
  reported:     { label: 'Reported',       variant: 'danger',  icon: AlertTriangle },
  acknowledged: { label: 'Acknowledged',   variant: 'warning', icon: Eye },
  in_progress:  { label: 'In Progress',    variant: 'info',    icon: Wrench },
  resolved:     { label: 'Resolved',       variant: 'success', icon: CheckCircle2 },
  closed:       { label: 'Closed',         variant: 'neutral', icon: CheckCircle2 },
};

const priorityConfig: Record<MaintenanceRequest['priority'], { label: string; color: string }> = {
  urgent: { label: 'Urgent',  color: 'bg-[#F04438] text-white' },
  high:   { label: 'High',    color: 'bg-[#F79009] text-white' },
  medium: { label: 'Medium',  color: 'bg-[#3157FF] text-white' },
  low:    { label: 'Low',     color: 'bg-gray-200 text-gray-700' },
};

const statusFlow: MaintenanceRequest['status'][] = ['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'];

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ request, isLandlord, onUpdateStatus, index }) => {
  const status = statusConfig[request.status];
  const priority = priorityConfig[request.priority];
  const StatusIcon = status.icon;

  const nextStatus = statusFlow[statusFlow.indexOf(request.status) + 1];

  const nextStatusLabel = nextStatus ? statusConfig[nextStatus].label : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-[#E4E7EC] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Status bar at top */}
      <div className={`h-1 ${
        request.status === 'reported' ? 'bg-[#F04438]' :
        request.status === 'acknowledged' ? 'bg-[#F79009]' :
        request.status === 'in_progress' ? 'bg-[#3157FF]' :
        request.status === 'resolved' ? 'bg-[#12B76A]' : 'bg-gray-300'
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-[#111827] truncate">{request.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-[#667085]">
              <Clock size={12} />
              <span>{format(new Date(request.created_at), 'dd MMM yyyy, hh:mm a')}</span>
              {request.room && (
                <>
                  <span className="text-[#E4E7EC]">•</span>
                  <span>{request.room}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priority.color}`}>
              {priority.label}
            </span>
            <Badge variant={status.variant} dot size="sm">
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#667085] leading-relaxed mb-4 line-clamp-2">
          {request.description}
        </p>

        {/* Category + resolved info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#F7F8FA] text-[#667085] px-2.5 py-1 rounded-full border border-[#E4E7EC]">
              {request.category}
            </span>
            {request.resolved_at && (
              <span className="text-xs text-[#12B76A] flex items-center gap-1">
                <CheckCircle2 size={12} />
                Resolved {format(new Date(request.resolved_at), 'dd MMM yyyy')}
              </span>
            )}
          </div>

          {/* Landlord action button */}
          {isLandlord && nextStatus && request.status !== 'closed' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(request.id, nextStatus)}
              className="flex items-center gap-1 text-xs font-medium text-[#3157FF] hover:text-[#2545d4] transition-colors bg-[#EFF4FF] hover:bg-[#dce6ff] px-3 py-1.5 rounded-lg"
            >
              Move to {nextStatusLabel} <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
