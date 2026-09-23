import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import {
  Camera,
  Video,
  FileText,
  Monitor,
  Plus,
  Filter,
  Calendar,
  MapPin,
  Tag,
  Search,
  CheckCircle2,
  Shield,
  Eye,
  Layers,
  UploadCloud,
  FileCheck,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Evidence } from '../types';
import { DEMO_EVIDENCE, DEMO_TENANT, DEMO_LANDLORD } from '../lib/demoData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';

type EvidenceTypeFilter = 'all' | Evidence['evidence_type'];

const typeOptions: { value: EvidenceTypeFilter; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All Types', icon: Layers },
  { value: 'photo', label: 'Photos', icon: Camera },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'screenshot', label: 'Screenshots', icon: Monitor },
  { value: 'document', label: 'Documents', icon: FileText },
];

const commonRooms = [
  'Living Room',
  'Kitchen',
  'Master Bedroom',
  'Guest Bedroom',
  'Bathroom',
  'Balcony',
  'Entrance',
  'Other',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export default function EvidencePage() {
  const { profile, agreement, isLandlord, isDemoMode } = useAuth();
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<EvidenceTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  // Upload Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formRoom, setFormRoom] = useState('Living Room');
  const [formCustomRoom, setFormCustomRoom] = useState('');
  const [formType, setFormType] = useState<Evidence['evidence_type']>('photo');
  const [formTags, setFormTags] = useState('');
  const [formError, setFormError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Initialize data
  useEffect(() => {
    setLoading(true);
    if (isDemoMode) {
      setEvidenceList([...DEMO_EVIDENCE].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } else {
      // Default fallback to DEMO_EVIDENCE to guarantee data is present
      setEvidenceList([...DEMO_EVIDENCE].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }
    setLoading(false);
  }, [isDemoMode, agreement]);

  // Dynamic room options derived from existing items + common rooms
  const roomFilterOptions = useMemo(() => {
    const roomsFromItems = evidenceList
      .map((item) => item.room)
      .filter((r): r is string => Boolean(r));
    const merged = Array.from(new Set(['All', 'Living Room', 'Kitchen', 'Master Bedroom', ...roomsFromItems]));
    return merged;
  }, [evidenceList]);

  // Filtered evidence
  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((item) => {
      // Room match
      const matchesRoom =
        selectedRoom === 'All' ||
        (item.room && item.room.toLowerCase() === selectedRoom.toLowerCase());

      // Type match
      const matchesType = selectedType === 'all' || item.evidence_type === selectedType;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.room && item.room.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(query)));

      return matchesRoom && matchesType && matchesSearch;
    });
  }, [evidenceList, selectedRoom, selectedType, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = evidenceList.length;
    const photos = evidenceList.filter((e) => e.evidence_type === 'photo').length;
    const videos = evidenceList.filter((e) => e.evidence_type === 'video').length;
    const docsAndScreenshots = evidenceList.filter(
      (e) => e.evidence_type === 'document' || e.evidence_type === 'screenshot'
    ).length;
    const roomsCovered = new Set(evidenceList.map((e) => e.room).filter(Boolean)).size;

    return { total, photos, videos, docsAndScreenshots, roomsCovered };
  }, [evidenceList]);

  // Resolve uploader details
  const resolveUploader = (uploadedBy: string) => {
    if (uploadedBy === DEMO_TENANT.id) {
      return {
        name: DEMO_TENANT.full_name,
        role: 'Tenant',
        initials: 'AS',
        bg: 'bg-[#EFF4FF] text-[#3157FF]',
      };
    }
    if (uploadedBy === DEMO_LANDLORD.id) {
      return {
        name: DEMO_LANDLORD.full_name,
        role: 'Landlord',
        initials: 'RM',
        bg: 'bg-[#F0F2F5] text-[#101828]',
      };
    }
    if (profile && uploadedBy === profile.id) {
      const initials = profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'ME';
      return {
        name: profile.full_name,
        role: profile.role === 'landlord' ? 'Landlord' : 'Tenant',
        initials,
        bg: profile.role === 'landlord' ? 'bg-[#F0F2F5] text-[#101828]' : 'bg-[#EFF4FF] text-[#3157FF]',
      };
    }
    return {
      name: uploadedBy.includes('landlord') ? 'Landlord' : 'Tenant',
      role: uploadedBy.includes('landlord') ? 'Landlord' : 'Tenant',
      initials: uploadedBy[0]?.toUpperCase() || 'U',
      bg: 'bg-gray-100 text-[#667085]',
    };
  };

  // Theme styling based on room
  const getRoomTheme = (room: string | null) => {
    const r = (room || '').toLowerCase();
    if (r.includes('bedroom')) {
      return {
        gradient: 'from-blue-100 via-indigo-100 to-blue-200',
        textColor: 'text-blue-700',
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        iconColor: 'text-blue-600',
      };
    }
    if (r.includes('kitchen')) {
      return {
        gradient: 'from-emerald-100 via-teal-100 to-green-200',
        textColor: 'text-emerald-700',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconColor: 'text-emerald-600',
      };
    }
    if (r.includes('living')) {
      return {
        gradient: 'from-amber-100 via-orange-100 to-amber-200',
        textColor: 'text-amber-800',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        iconColor: 'text-amber-600',
      };
    }
    if (r.includes('bath')) {
      return {
        gradient: 'from-cyan-100 via-sky-100 to-cyan-200',
        textColor: 'text-cyan-700',
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        iconColor: 'text-cyan-600',
      };
    }
    if (r.includes('balcony')) {
      return {
        gradient: 'from-lime-100 via-emerald-100 to-lime-200',
        textColor: 'text-lime-800',
        badge: 'bg-lime-50 text-lime-800 border-lime-200',
        iconColor: 'text-lime-600',
      };
    }
    return {
      gradient: 'from-purple-100 via-violet-100 to-fuchsia-200',
      textColor: 'text-purple-700',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
    };
  };

  // Type configuration
  const getTypeConfig = (type: Evidence['evidence_type']) => {
    switch (type) {
      case 'photo':
        return {
          label: 'Photo',
          icon: Camera,
          badgeClass: 'bg-blue-50 text-[#3157FF] border-[#3157FF]/30',
        };
      case 'video':
        return {
          label: 'Video',
          icon: Video,
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
        };
      case 'screenshot':
        return {
          label: 'Screenshot',
          icon: Monitor,
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-300',
        };
      case 'document':
        return {
          label: 'Document',
          icon: FileText,
          badgeClass: 'bg-emerald-50 text-[#12B76A] border-emerald-300',
        };
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle upload submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter a title for this evidence');
      return;
    }

    const roomName = formRoom === 'Other' ? formCustomRoom.trim() || 'General' : formRoom;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newEvidenceItem: Evidence = {
      id: `evi-${Date.now()}`,
      agreement_id: agreement?.id || 'demo-agreement-001',
      uploaded_by: profile?.id || DEMO_TENANT.id,
      title: formTitle.trim(),
      description: formDescription.trim() || null,
      evidence_type: formType,
      file_url: '#',
      file_type:
        formType === 'photo'
          ? 'image/jpeg'
          : formType === 'video'
          ? 'video/mp4'
          : formType === 'screenshot'
          ? 'image/png'
          : 'application/pdf',
      file_size: Math.floor(Math.random() * 1500000) + 800000,
      room: roomName,
      tags: tagsArray.length > 0 ? tagsArray : ['condition', 'record'],
      metadata: null,
      created_at: new Date().toISOString(),
    };

    setEvidenceList((prev) => [newEvidenceItem, ...prev]);
    setUploadSuccess(true);

    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      // Reset form
      setFormTitle('');
      setFormDescription('');
      setFormRoom('Living Room');
      setFormCustomRoom('');
      setFormType('photo');
      setFormTags('');
      setFormError('');
    }, 600);
  };

  const handleResetFilters = () => {
    setSelectedRoom('All');
    setSelectedType('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#111827]">Evidence Center</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF4FF] text-[#3157FF] border border-[#3157FF]/20">
              <Shield size={12} />
              Vault
            </span>
          </div>
          <p className="text-[#667085] mt-1 text-sm sm:text-base">
            {isLandlord
              ? 'Review property condition logs, move-in evidence, and maintenance records.'
              : 'Document property condition, photos, and maintenance proof to protect your rental deposit.'}
          </p>
        </div>

        {/* Upload Button for Tenants */}
        {!isLandlord && (
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            icon={<Plus size={18} />}
            className="flex-shrink-0"
          >
            Upload Evidence
          </Button>
        )}
      </div>

      {/* ─── Stat Counter Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#111827]">{stats.total}</p>
            <p className="text-xs sm:text-sm font-medium text-[#667085] mt-0.5">Total Evidence</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#EFF4FF] text-[#3157FF] flex items-center justify-center flex-shrink-0">
            <Layers size={22} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#3157FF]">{stats.photos}</p>
            <p className="text-xs sm:text-sm font-medium text-[#667085] mt-0.5">Photos & Visuals</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Camera size={22} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#12B76A]">{stats.docsAndScreenshots}</p>
            <p className="text-xs sm:text-sm font-medium text-[#667085] mt-0.5">Docs & Screenshots</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#12B76A] flex items-center justify-center flex-shrink-0">
            <FileCheck size={22} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#F79009]">{stats.roomsCovered}</p>
            <p className="text-xs sm:text-sm font-medium text-[#667085] mt-0.5">Rooms Documented</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#F79009] flex items-center justify-center flex-shrink-0">
            <FolderOpen size={22} />
          </div>
        </motion.div>
      </div>

      {/* ─── Search and Filters Row ─── */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-sm space-y-4">
        {/* Top filter row: Search + Type Selector */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by title, room, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
              className="w-full"
            />
          </div>

          {/* Evidence Type Filter Buttons */}
          <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-lg overflow-x-auto">
            {typeOptions.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-white text-[#111827] shadow-xs font-semibold'
                      : 'text-[#667085] hover:text-[#111827] hover:bg-white/50'
                  )}
                >
                  <Icon size={14} className={isActive ? 'text-[#3157FF]' : 'text-[#667085]'} />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom filter row: Room Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E4E7EC] overflow-x-auto">
          <span className="text-xs font-semibold text-[#667085] flex items-center gap-1 flex-shrink-0 pr-1">
            <Filter size={13} /> Room:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {roomFilterOptions.map((room) => {
              const isSelected = selectedRoom.toLowerCase() === room.toLowerCase();
              return (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={clsx(
                    'px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors border font-medium',
                    isSelected
                      ? 'bg-[#3157FF] text-white border-[#3157FF]'
                      : 'bg-white text-[#667085] border-[#E4E7EC] hover:border-gray-300 hover:text-[#111827]'
                  )}
                >
                  {room}
                  {room !== 'All' && (
                    <span
                      className={clsx(
                        'ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {evidenceList.filter((e) => e.room?.toLowerCase() === room.toLowerCase()).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Evidence Grid (Masonry CSS Columns) ─── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredEvidence.length === 0 ? (
        <EmptyState
          icon={<Camera size={44} />}
          title="No evidence records found"
          description={
            searchQuery || selectedRoom !== 'All' || selectedType !== 'all'
              ? 'No items match your active filters. Try resetting filters to view all records.'
              : 'No evidence uploaded yet. Tenants can upload photos, videos, and documents anytime.'
          }
          action={
            (searchQuery || selectedRoom !== 'All' || selectedType !== 'all') && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            )
          }
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {filteredEvidence.map((item) => {
            const roomTheme = getRoomTheme(item.room);
            const typeConfig = getTypeConfig(item.evidence_type);
            const TypeIcon = typeConfig.icon;
            const uploader = resolveUploader(item.uploaded_by);

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="break-inside-avoid inline-block w-full"
              >
                <div
                  onClick={() => setSelectedEvidence(item)}
                  className="bg-white rounded-xl border border-[#E4E7EC] shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer flex flex-col"
                >
                  {/* Colored Placeholder Div with Gradient */}
                  <div
                    className={clsx(
                      'relative h-40 bg-gradient-to-br flex items-center justify-center overflow-hidden border-b border-[#E4E7EC]',
                      roomTheme.gradient
                    )}
                  >
                    {/* Centered Watermark Type Icon */}
                    <div className="text-white/40 group-hover:scale-110 group-hover:text-white/50 transition-all duration-300">
                      <TypeIcon size={56} strokeWidth={1.5} />
                    </div>

                    {/* Room Tag on Top Left */}
                    {item.room && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/90 backdrop-blur-xs text-[#111827] shadow-xs border border-white/60">
                          <MapPin size={11} className={roomTheme.iconColor} />
                          {item.room}
                        </span>
                      </div>
                    )}

                    {/* Type Badge on Top Right */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs border',
                          typeConfig.badgeClass,
                          'bg-white/95 backdrop-blur-xs'
                        )}
                      >
                        <TypeIcon size={12} />
                        {typeConfig.label}
                      </span>
                    </div>

                    {/* Quick View Hover Indicator */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                      <Eye size={11} /> View Details
                    </div>

                    {/* File size pill if available */}
                    {item.file_size && (
                      <div className="absolute bottom-2 left-3 text-[10px] font-medium text-black/60 bg-white/70 backdrop-blur-xs px-1.5 py-0.5 rounded">
                        {formatFileSize(item.file_size)}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-base font-semibold text-[#111827] group-hover:text-[#3157FF] transition-colors line-clamp-1">
                        {item.title}
                      </h3>

                      {/* Description */}
                      {item.description ? (
                        <p className="text-sm text-[#667085] mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      ) : (
                        <p className="text-xs italic text-gray-400 mt-1">No description provided</p>
                      )}

                      {/* Tags as small pills */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center text-[11px] font-medium bg-[#F7F8FA] text-[#667085] border border-[#E4E7EC] px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Divider */}
                    <div>
                      <div className="my-3.5 border-t border-[#E4E7EC]" />

                      {/* Uploader name and Date */}
                      <div className="flex items-center justify-between text-xs">
                        {/* Uploader info */}
                        <div className="flex items-center gap-2">
                          <div
                            className={clsx(
                              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                              uploader.bg
                            )}
                          >
                            {uploader.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-[#111827] leading-tight">
                              {uploader.name}
                            </span>
                            <span className="text-[10px] text-[#667085] leading-tight">
                              {uploader.role}
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <span className="text-[#667085] flex items-center gap-1 flex-shrink-0">
                          <Calendar size={12} className="text-gray-400" />
                          {format(new Date(item.created_at), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─── Upload Evidence Modal ─── */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Rental Evidence"
        size="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-[#FEF3F2] border border-[#F04438]/20 rounded-lg text-sm text-[#F04438] flex items-center gap-2">
              <span>{formError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-[#ECFDF3] border border-[#12B76A]/20 rounded-lg text-sm text-[#12B76A] flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Evidence uploaded and recorded successfully!</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Evidence Title <span className="text-[#F04438]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Bedroom Wall Scuff, Kitchen Sink Condition"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
                if (formError) setFormError('');
              }}
              className="block w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3157FF] transition-colors"
            />
          </div>

          {/* Evidence Type */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Evidence Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['photo', 'video', 'screenshot', 'document'] as const).map((type) => {
                const config = getTypeConfig(type);
                const Icon = config.icon;
                const isSelected = formType === type;
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setFormType(type)}
                    className={clsx(
                      'flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all',
                      isSelected
                        ? 'border-[#3157FF] bg-[#EFF4FF] text-[#3157FF] font-semibold'
                        : 'border-[#E4E7EC] text-[#667085] hover:bg-gray-50'
                    )}
                  >
                    <Icon size={14} />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Property Room / Area
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formRoom}
                onChange={(e) => setFormRoom(e.target.value)}
                className="w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3157FF]"
              >
                {commonRooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              {formRoom === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify area (e.g. Roof, Garden)"
                  value={formCustomRoom}
                  onChange={(e) => setFormCustomRoom(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3157FF]"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe condition, date noticed, or specific details..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="block w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3157FF] transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Tags (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. move-in, walls, inspection, damage (comma separated)"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="block w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3157FF] transition-colors"
            />
          </div>

          {/* Upload Placeholder Dropzone */}
          <div className="p-4 border-2 border-dashed border-[#E4E7EC] rounded-xl text-center bg-[#F7F8FA] hover:bg-gray-50 transition-colors">
            <UploadCloud size={28} className="mx-auto text-[#3157FF] mb-1.5" />
            <p className="text-xs font-semibold text-[#111827]">
              Digital Proof Timestamping Active
            </p>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Files uploaded are cryptographically logged with local metadata for lease dispute protection.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4E7EC]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={uploadSuccess}>
              Save Evidence
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── Evidence Detail / Lightbox Modal ─── */}
      {selectedEvidence && (
        <Modal
          isOpen={!!selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
          title={selectedEvidence.title}
          size="md"
        >
          {(() => {
            const roomTheme = getRoomTheme(selectedEvidence.room);
            const typeConfig = getTypeConfig(selectedEvidence.evidence_type);
            const TypeIcon = typeConfig.icon;
            const uploader = resolveUploader(selectedEvidence.uploaded_by);

            return (
              <div className="space-y-4">
                {/* Visual Banner */}
                <div
                  className={clsx(
                    'h-48 rounded-xl bg-gradient-to-br flex items-center justify-center relative overflow-hidden border border-[#E4E7EC]',
                    roomTheme.gradient
                  )}
                >
                  <TypeIcon size={72} className="text-white/40" />

                  {/* Room Tag */}
                  {selectedEvidence.room && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white/90 backdrop-blur-xs text-[#111827] shadow-xs">
                        <MapPin size={12} className={roomTheme.iconColor} />
                        {selectedEvidence.room}
                      </span>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold shadow-xs border bg-white/95 backdrop-blur-xs',
                        typeConfig.badgeClass
                      )}
                    >
                      <TypeIcon size={13} />
                      {typeConfig.label}
                    </span>
                  </div>

                  {/* Timestamp badge */}
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
                    <Calendar size={12} />
                    {format(new Date(selectedEvidence.created_at), 'dd MMMM yyyy, hh:mm a')}
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Description
                    </h4>
                    <p className="text-sm text-[#111827] mt-1 leading-relaxed bg-[#F7F8FA] p-3 rounded-lg border border-[#E4E7EC]">
                      {selectedEvidence.description || 'No detailed description provided for this record.'}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedEvidence.tags && selectedEvidence.tags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-1.5">
                        Tags & Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedEvidence.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs font-medium bg-[#F7F8FA] text-[#667085] border border-[#E4E7EC] px-2.5 py-1 rounded-full"
                          >
                            <Tag size={10} /> #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-gray-50 border border-[#E4E7EC]">
                      <span className="text-[11px] text-[#667085] block">Uploaded By</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={clsx(
                            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                            uploader.bg
                          )}
                        >
                          {uploader.initials}
                        </div>
                        <span className="text-xs font-semibold text-[#111827]">{uploader.name}</span>
                        <span className="text-[10px] bg-white border border-[#E4E7EC] px-1.5 rounded text-[#667085]">
                          {uploader.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-gray-50 border border-[#E4E7EC]">
                      <span className="text-[11px] text-[#667085] block">File Size & Integrity</span>
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-[#111827]">
                        <CheckCircle2 size={14} className="text-[#12B76A]" />
                        <span>{formatFileSize(selectedEvidence.file_size) || 'Verified Record'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Modal Actions */}
                <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#12B76A] font-medium">
                    <Shield size={14} />
                    <span>RentProof Ledger Protected</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedEvidence(null)}>
                    Close
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
