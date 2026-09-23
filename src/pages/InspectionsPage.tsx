import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  ClipboardList,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Home,
  FileText,
  Filter,
  Camera,
  FileCheck,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { PropertyInspection, RoomCondition } from '../types';
import { DEMO_INSPECTIONS } from '../lib/demoData';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

type TypeFilter = 'all' | PropertyInspection['inspection_type'];

const typeTabs: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All Inspections' },
  { value: 'move_in', label: 'Move-in' },
  { value: 'routine', label: 'Routine' },
  { value: 'move_out', label: 'Move-out' },
  { value: 'special', label: 'Special' },
];

export default function InspectionsPage() {
  const { agreement, profile, isLandlord, isDemoMode, loading: authLoading } = useAuth();
  const [inspections, setInspections] = useState<PropertyInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Inspection Form State
  const [newType, setNewType] = useState<PropertyInspection['inspection_type']>('routine');
  const [newDate, setNewDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      // Sort: scheduled first or by inspection date descending
      const sorted = [...DEMO_INSPECTIONS].sort(
        (a, b) => new Date(b.inspection_date).getTime() - new Date(a.inspection_date).getTime()
      );
      setInspections(sorted);
      setLoading(false);
    } else {
      // Supabase / Production mode fallback
      setInspections([]);
      setLoading(false);
    }
  }, [isDemoMode, agreement]);

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    setIsSubmitting(true);
    const newInspection: PropertyInspection = {
      id: `insp-${Date.now()}`,
      agreement_id: agreement?.id || 'demo-agreement',
      inspector_id: profile?.id || 'demo-inspector',
      inspection_type: newType,
      inspection_date: newDate,
      status: 'scheduled',
      rooms: null,
      overall_condition: null,
      notes: newNotes.trim() || null,
      photos: null,
      tenant_signed: false,
      landlord_signed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setInspections(prev => [newInspection, ...prev]);
    setIsSubmitting(false);
    setNewNotes('');
    setNewType('routine');
    setIsModalOpen(false);
  };

  const handleSignOff = (inspectionId: string) => {
    setInspections(prev =>
      prev.map(item => {
        if (item.id !== inspectionId) return item;
        const willTenantSign = !isLandlord ? true : item.tenant_signed;
        const willLandlordSign = isLandlord ? true : item.landlord_signed;
        const bothSigned = willTenantSign && willLandlordSign;

        return {
          ...item,
          tenant_signed: willTenantSign,
          landlord_signed: willLandlordSign,
          status: bothSigned ? 'signed_off' : item.status,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const filteredInspections =
    typeFilter === 'all'
      ? inspections
      : inspections.filter(item => item.inspection_type === typeFilter);

  // Compute Stats
  const stats = {
    total: inspections.length,
    completed: inspections.filter(
      item => item.status === 'completed' || item.status === 'signed_off'
    ).length,
    upcoming: inspections.filter(
      item => item.status === 'scheduled' || item.status === 'in_progress'
    ).length,
  };

  const formatDateSafely = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const getTypeBadgeVariant = (type: PropertyInspection['inspection_type']): 'info' | 'warning' | 'danger' | 'neutral' => {
    switch (type) {
      case 'move_in':
        return 'info';
      case 'move_out':
        return 'warning';
      case 'special':
        return 'danger';
      case 'routine':
      default:
        return 'neutral';
    }
  };

  const getTypeLabel = (type: PropertyInspection['inspection_type']) => {
    switch (type) {
      case 'move_in':
        return 'Move-in';
      case 'move_out':
        return 'Move-out';
      case 'routine':
        return 'Routine';
      case 'special':
        return 'Special';
    }
  };

  const getStatusBadgeVariant = (status: PropertyInspection['status']): 'success' | 'warning' | 'info' | 'neutral' => {
    switch (status) {
      case 'signed_off':
        return 'success';
      case 'completed':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'scheduled':
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: PropertyInspection['status']) => {
    switch (status) {
      case 'signed_off':
        return 'Signed Off';
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'scheduled':
        return 'Scheduled';
    }
  };

  const getRoomConditionVariant = (
    condition: RoomCondition['condition']
  ): 'success' | 'info' | 'warning' | 'danger' => {
    switch (condition) {
      case 'excellent':
        return 'success'; // green
      case 'good':
        return 'info'; // blue
      case 'fair':
        return 'warning'; // warning / amber
      case 'poor':
        return 'danger'; // danger / red
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Property Inspections</h1>
          <p className="text-[#667085] mt-1 text-sm">
            Room-by-room condition vault, condition verification, and bilateral digital sign-offs.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={18} /> Schedule Inspection
        </Button>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-medium text-[#667085] uppercase tracking-wider">
              Total Inspections
            </p>
            <p className="text-2xl font-bold text-[#111827] mt-1">{stats.total}</p>
          </div>
          <div className="p-3 bg-[#F7F8FA] rounded-xl border border-[#E4E7EC] text-[#3157FF]">
            <ClipboardList size={22} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-medium text-[#667085] uppercase tracking-wider">
              Completed & Verified
            </p>
            <p className="text-2xl font-bold text-[#12B76A] mt-1">{stats.completed}</p>
          </div>
          <div className="p-3 bg-[#ECFDF3] rounded-xl border border-[#12B76A]/20 text-[#12B76A]">
            <CheckCircle2 size={22} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-medium text-[#667085] uppercase tracking-wider">
              Upcoming & Active
            </p>
            <p className="text-2xl font-bold text-[#3157FF] mt-1">{stats.upcoming}</p>
          </div>
          <div className="p-3 bg-[#EFF4FF] rounded-xl border border-[#3157FF]/20 text-[#3157FF]">
            <CalendarClock size={22} />
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-xl overflow-x-auto border border-[#E4E7EC]">
        <Filter size={16} className="text-[#667085] ml-2 mr-1 flex-shrink-0" />
        {typeTabs.map(tab => {
          const count =
            tab.value === 'all'
              ? inspections.length
              : inspections.filter(i => i.inspection_type === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setTypeFilter(tab.value)}
              className={clsx(
                "px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5",
                typeFilter === tab.value
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#667085] hover:text-[#111827]"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={clsx(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  typeFilter === tab.value
                    ? "bg-[#EFF4FF] text-[#3157FF]"
                    : "bg-[#E4E7EC] text-[#667085]"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. List of Inspection Cards */}
      {filteredInspections.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck size={48} />}
          title={
            typeFilter === 'all'
              ? 'No Property Inspections Found'
              : `No ${typeFilter.replace('_', '-')} Inspections`
          }
          description={
            isDemoMode
              ? 'There are no inspections matching the selected filter. Try choosing "All Inspections" or schedule a new one.'
              : 'Property inspections and room-by-room condition logs will appear here once conducted.'
          }
          action={
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus size={16} /> Schedule Inspection
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {filteredInspections.map((inspection, index) => {
            const hasRooms = inspection.rooms && Object.keys(inspection.rooms).length > 0;
            const canSignOff =
              (isLandlord && !inspection.landlord_signed) ||
              (!isLandlord && !inspection.tenant_signed);

            return (
              <motion.div
                key={inspection.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-white rounded-xl border border-[#E4E7EC] shadow-sm p-6 space-y-6 hover:border-[#3157FF]/40 transition-colors"
              >
                {/* Inspection Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EC] pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant={getTypeBadgeVariant(inspection.inspection_type)} size="md">
                      {getTypeLabel(inspection.inspection_type)} Inspection
                    </Badge>
                    <Badge
                      variant={getStatusBadgeVariant(inspection.status)}
                      size="md"
                      dot
                    >
                      {getStatusLabel(inspection.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#475467] font-medium bg-[#F7F8FA] px-3 py-1.5 rounded-lg border border-[#E4E7EC]">
                    <Calendar size={16} className="text-[#3157FF]" />
                    <span>Inspection Date: {formatDateSafely(inspection.inspection_date)}</span>
                  </div>
                </div>

                {/* Overall Condition Summary */}
                {inspection.overall_condition && (
                  <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl p-4 flex items-start gap-3.5">
                    <div className="p-2 bg-white rounded-lg border border-[#E4E7EC] text-[#3157FF] shadow-xs flex-shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] block">
                        Overall Condition Summary
                      </span>
                      <p className="text-sm font-medium text-[#111827] mt-0.5 leading-relaxed">
                        {inspection.overall_condition}
                      </p>
                    </div>
                  </div>
                )}

                {/* General Notes if any */}
                {inspection.notes && (
                  <div className="text-xs text-[#475467] bg-[#F7F8FA]/60 border border-[#E4E7EC] rounded-lg p-3 flex items-start gap-2.5">
                    <FileText size={15} className="text-[#667085] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-[#111827] mr-1.5">Remarks:</span>
                      <span>{inspection.notes}</span>
                    </div>
                  </div>
                )}

                {/* Room-by-room Condition Vault Grid */}
                {hasRooms ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-[#3157FF]" />
                        <h2 className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                          Room-by-Room Condition Vault
                        </h2>
                      </div>
                      <span className="text-xs text-[#667085] font-medium">
                        {Object.keys(inspection.rooms!).length} areas evaluated
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {Object.entries(inspection.rooms!).map(([key, room]) => {
                        const conditionVariant = getRoomConditionVariant(room.condition);

                        return (
                          <div
                            key={key}
                            className="bg-[#F7F8FA] rounded-xl p-3.5 border border-[#E4E7EC] flex flex-col justify-between hover:bg-white hover:border-[#3157FF]/30 transition-all"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-sm font-semibold text-[#111827] truncate">
                                  {room.name || key}
                                </span>
                                <Badge variant={conditionVariant} size="sm">
                                  {room.condition}
                                </Badge>
                              </div>
                              <p className="text-xs text-[#475467] leading-relaxed line-clamp-3">
                                {room.notes || 'Condition verified in good order.'}
                              </p>
                            </div>

                            {room.photos && room.photos.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-[#E4E7EC] flex items-center gap-1.5 text-[11px] font-medium text-[#3157FF]">
                                <Camera size={13} />
                                <span>{room.photos.length} photo evidence attached</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F7F8FA] border border-dashed border-[#E4E7EC] rounded-xl p-4 flex items-center gap-3 text-xs text-[#667085]">
                    <CalendarClock size={18} className="text-[#3157FF] flex-shrink-0" />
                    <span>
                      Room-by-room condition check and photographic evidence will be logged during the walkthrough on the scheduled date.
                    </span>
                  </div>
                )}

                {/* Signed-off Bilateral Verification */}
                <div className="pt-4 border-t border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold text-[#667085] mr-1">
                      Digital Sign-off:
                    </span>

                    {/* Tenant Indicator */}
                    <div
                      className={clsx(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                        inspection.tenant_signed
                          ? "bg-[#ECFDF3] border-[#12B76A]/30 text-[#12B76A]"
                          : "bg-gray-50 border-[#E4E7EC] text-[#667085]"
                      )}
                    >
                      {inspection.tenant_signed ? (
                        <CheckCircle2 size={15} className="text-[#12B76A]" />
                      ) : (
                        <Clock size={15} className="text-[#667085]" />
                      )}
                      <span>
                        Tenant {inspection.tenant_signed ? 'Signed Off' : 'Pending'}
                      </span>
                    </div>

                    {/* Landlord Indicator */}
                    <div
                      className={clsx(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                        inspection.landlord_signed
                          ? "bg-[#ECFDF3] border-[#12B76A]/30 text-[#12B76A]"
                          : "bg-gray-50 border-[#E4E7EC] text-[#667085]"
                      )}
                    >
                      {inspection.landlord_signed ? (
                        <CheckCircle2 size={15} className="text-[#12B76A]" />
                      ) : (
                        <Clock size={15} className="text-[#667085]" />
                      )}
                      <span>
                        Landlord {inspection.landlord_signed ? 'Signed Off' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Sign Off Action Button */}
                  {canSignOff && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleSignOff(inspection.id)}
                      className="flex items-center gap-1.5 self-start sm:self-auto text-xs"
                    >
                      <FileCheck size={14} />
                      Sign Off As {isLandlord ? 'Landlord' : 'Tenant'}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Schedule Inspection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#101828]/50 backdrop-blur-xs"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl border border-[#E4E7EC] relative z-10 w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E4E7EC]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#EFF4FF] rounded-lg text-[#3157FF]">
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#111827]">Schedule Inspection</h2>
                    <p className="text-xs text-[#667085]">
                      Plan a property walkthrough and condition audit
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:text-[#111827] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateInspection} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Inspection Type <span className="text-[#F04438]">*</span>
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as PropertyInspection['inspection_type'])}
                    className="block w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EFF4FF] focus:border-[#3157FF] transition-colors"
                  >
                    <option value="routine">Routine Inspection</option>
                    <option value="move_in">Move-in Inspection</option>
                    <option value="move_out">Move-out Inspection</option>
                    <option value="special">Special / Maintenance Inspection</option>
                  </select>
                </div>

                <div>
                  <Input
                    label="Inspection Date"
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Notes & Scope
                  </label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="e.g. 6-month routine condition check, focus on bathroom plumbing and kitchen appliances."
                    className="block w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EFF4FF] focus:border-[#3157FF] transition-colors resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <ClipboardCheck size={16} /> Schedule Inspection
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
