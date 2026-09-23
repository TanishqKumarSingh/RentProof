import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wrench, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MaintenanceRequest } from '../types';
import { MaintenanceCard } from '../components/maintenance/MaintenanceCard';
import { CreateMaintenanceModal } from '../components/maintenance/CreateMaintenanceModal';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { DEMO_MAINTENANCE } from '../lib/demoData';

type StatusFilter = 'all' | MaintenanceRequest['status'];

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: 'all',          label: 'All' },
  { value: 'reported',     label: 'Reported' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'in_progress',  label: 'In Progress' },
  { value: 'resolved',     label: 'Resolved' },
  { value: 'closed',       label: 'Closed' },
];

export default function MaintenancePage() {
  const { profile, agreement, isLandlord, isDemoMode } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (isDemoMode) {
      setRequests([...DEMO_MAINTENANCE].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setLoading(false);
    } else {
      // TODO: fetch from Supabase
      setLoading(false);
    }
  }, [isDemoMode, agreement]);

  const handleCreate = (data: Partial<MaintenanceRequest>) => {
    const newRequest: MaintenanceRequest = {
      id: `maint-new-${Date.now()}`,
      agreement_id: agreement?.id || 'demo',
      reported_by: profile?.id || 'demo',
      title: data.title || 'Untitled',
      description: data.description || '',
      category: data.category || 'General',
      priority: data.priority || 'medium',
      status: 'reported',
      room: data.room || null,
      photos: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleUpdateStatus = (id: string, newStatus: MaintenanceRequest['status']) => {
    setRequests(prev => prev.map(r =>
      r.id === id
        ? {
            ...r,
            status: newStatus,
            updated_at: new Date().toISOString(),
            resolved_at: newStatus === 'resolved' ? new Date().toISOString() : r.resolved_at,
          }
        : r
    ));
  };

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter(r => r.status === statusFilter);

  // Stats
  const stats = {
    total: requests.length,
    open: requests.filter(r => ['reported', 'acknowledged', 'in_progress'].includes(r.status)).length,
    resolved: requests.filter(r => r.status === 'resolved' || r.status === 'closed').length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Maintenance Requests</h1>
          <p className="text-[#667085] mt-1">
            {isLandlord ? 'Manage and resolve tenant maintenance requests.' : 'Report issues and track repair progress.'}
          </p>
        </div>
        {!isLandlord && (
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} /> Report Issue
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-sm text-center">
          <p className="text-2xl font-bold text-[#111827]">{stats.total}</p>
          <p className="text-xs text-[#667085] mt-1">Total Requests</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-sm text-center">
          <p className="text-2xl font-bold text-[#F79009]">{stats.open}</p>
          <p className="text-xs text-[#667085] mt-1">Open</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-sm text-center">
          <p className="text-2xl font-bold text-[#12B76A]">{stats.resolved}</p>
          <p className="text-xs text-[#667085] mt-1">Resolved</p>
        </motion.div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-xl overflow-x-auto">
        <Filter size={16} className="text-[#667085] ml-2 mr-1 flex-shrink-0" />
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-[#667085] hover:text-[#111827]'
            }`}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ml-1 text-[10px] opacity-60">
                ({requests.filter(r => r.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request list */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={<Wrench size={48} />}
          title={statusFilter === 'all' ? 'No maintenance requests yet' : `No "${statusFilter}" requests`}
          description={
            isLandlord
              ? 'Tenant maintenance requests will appear here.'
              : 'Click "Report Issue" to submit your first maintenance request.'
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <MaintenanceCard
              key={request.id}
              request={request}
              isLandlord={!!isLandlord}
              onUpdateStatus={handleUpdateStatus}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <CreateMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
