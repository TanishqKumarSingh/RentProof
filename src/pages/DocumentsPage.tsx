import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Upload,
  Download,
  Filter,
  Search,
  FileText,
  User,
  Shield,
  FileUp,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Document } from '../types';
import { DEMO_DOCUMENTS, DEMO_TENANT, DEMO_LANDLORD } from '../lib/demoData';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';

type CategoryFilter = 'all' | 'agreement' | 'identity' | 'receipt' | 'inspection' | 'general';

interface CategoryTab {
  id: CategoryFilter;
  label: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: 'all', label: 'All' },
  { id: 'agreement', label: 'Agreement' },
  { id: 'identity', label: 'Identity' },
  { id: 'receipt', label: 'Receipt' },
  { id: 'inspection', label: 'Inspection' },
  { id: 'general', label: 'General' },
];

export default function DocumentsPage() {
  const { isDemoMode, profile, agreement } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Upload Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<Document['category']>('agreement');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    if (isDemoMode) {
      setDocuments([...DEMO_DOCUMENTS]);
    } else {
      setDocuments([...DEMO_DOCUMENTS]);
    }
    setLoading(false);
  }, [isDemoMode]);

  // Determine file icon (📄 for pdf, 🖼️ for image, 📋 for others)
  const getFileIcon = (fileType: string, fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const mime = (fileType || '').toLowerCase();

    if (mime.includes('pdf') || ext === 'pdf') {
      return '📄';
    }
    if (
      mime.includes('image') ||
      ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)
    ) {
      return '🖼️';
    }
    return '📋';
  };

  // Format file size into KB / MB
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes || bytes <= 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  // Get badge variant for each category
  const getCategoryBadgeVariant = (category: Document['category']): 'info' | 'warning' | 'success' | 'neutral' | 'danger' => {
    switch (category) {
      case 'agreement':
        return 'info';
      case 'identity':
        return 'warning';
      case 'receipt':
        return 'success';
      case 'inspection':
        return 'neutral';
      case 'notice':
        return 'danger';
      case 'general':
      default:
        return 'neutral';
    }
  };

  // Compare uploaded_by with DEMO_TENANT.id / DEMO_LANDLORD.id to show name
  const getUploaderName = (uploadedBy: string): string => {
    if (uploadedBy === DEMO_TENANT.id) {
      return DEMO_TENANT.full_name;
    }
    if (uploadedBy === DEMO_LANDLORD.id) {
      return DEMO_LANDLORD.full_name;
    }
    if (profile && profile.id === uploadedBy) {
      return profile.full_name;
    }
    return 'Tenant';
  };

  const getUploaderRole = (uploadedBy: string): string => {
    if (uploadedBy === DEMO_TENANT.id) {
      return 'Tenant';
    }
    if (uploadedBy === DEMO_LANDLORD.id) {
      return 'Landlord';
    }
    if (profile && profile.id === uploadedBy) {
      return profile.role === 'landlord' ? 'Landlord' : 'Tenant';
    }
    return 'Tenant';
  };

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory =
        selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = documents.length;
    const tenantDocs = documents.filter(
      (d) =>
        d.uploaded_by === DEMO_TENANT.id ||
        (profile?.role === 'tenant' && d.uploaded_by === profile.id)
    ).length;
    const landlordDocs = documents.filter(
      (d) =>
        d.uploaded_by === DEMO_LANDLORD.id ||
        (profile?.role === 'landlord' && d.uploaded_by === profile.id)
    ).length;

    return { total, tenantDocs, landlordDocs };
  }, [documents, profile]);

  const resetForm = () => {
    setFormName('');
    setFormCategory('agreement');
    setFormDescription('');
    setFormError('');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setFormError('Please enter a document name');
      return;
    }

    const isImage = /\.(jpe?g|png|webp|gif|svg)$/i.test(formName.trim());
    const isPdf = /\.pdf$/i.test(formName.trim());
    const detectedType = isPdf ? 'application/pdf' : isImage ? 'image/png' : 'application/pdf';

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      agreement_id: agreement?.id || 'demo-agreement-001',
      uploaded_by: profile?.id || DEMO_TENANT.id,
      name: formName.trim(),
      file_url: '#',
      file_type: detectedType,
      file_size: Math.floor(120000 + Math.random() * 380000), // realistic random size
      category: formCategory,
      description: formDescription.trim() || null,
      created_at: new Date().toISOString(),
    };

    setDocuments((prev) => [newDocument, ...prev]);
    resetForm();
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Document Locker</h1>
          <p className="text-[#667085] mt-1 text-sm">
            Centralized digital vault for rental agreements, KYC records, and payment receipts.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload size={18} />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* 4. Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-[#EFF4FF] text-[#3157FF] rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#111827]">{stats.total}</p>
            <p className="text-xs font-medium text-[#667085] mt-0.5">Total Documents</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-[#ECFDF3] text-[#12B76A] rounded-xl flex items-center justify-center flex-shrink-0">
            <User size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[#12B76A]">{stats.tenantDocs}</p>
            <p className="text-xs font-medium text-[#667085] mt-0.5 truncate">
              By Tenant ({DEMO_TENANT.full_name.split(' ')[0]})
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-[#FFFAEB] text-[#F79009] rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[#F79009]">{stats.landlordDocs}</p>
            <p className="text-xs font-medium text-[#667085] mt-0.5 truncate">
              By Landlord ({DEMO_LANDLORD.full_name.split(' ')[0]})
            </p>
          </div>
        </motion.div>
      </div>

      {/* 2. Category filter tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-xl border border-[#E4E7EC] overflow-x-auto scrollbar-none">
          <Filter size={16} className="text-[#667085] ml-2 mr-1 flex-shrink-0" />
          {CATEGORY_TABS.map((tab) => {
            const count =
              tab.id === 'all'
                ? documents.length
                : documents.filter((d) => d.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-white text-[#111827] shadow-sm font-semibold'
                    : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === tab.id
                      ? 'bg-[#EFF4FF] text-[#3157FF]'
                      : 'bg-gray-200/70 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative md:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E4E7EC] rounded-xl pl-9 pr-8 py-2 text-xs text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#3157FF] focus:ring-2 focus:ring-[#EFF4FF] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Document cards in a grid (2 cols desktop, 1 col mobile) */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="No documents found"
          description={
            searchQuery
              ? `No documents matching "${searchQuery}" in ${selectedCategory === 'all' ? 'any category' : selectedCategory}.`
              : selectedCategory === 'all'
              ? 'Your document locker is currently empty. Upload your first document.'
              : `No documents uploaded under the "${selectedCategory}" category.`
          }
          action={
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              size="sm"
              icon={<Upload size={16} />}
            >
              Upload Document
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((doc, index) => {
            const uploaderName = getUploaderName(doc.uploaded_by);
            const uploaderRole = getUploaderRole(doc.uploaded_by);
            const badgeVariant = getCategoryBadgeVariant(doc.category);
            const iconEmoji = getFileIcon(doc.file_type, doc.name);

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="bg-white rounded-xl border border-[#E4E7EC] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon, File name, and Category badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] flex items-center justify-center text-2xl flex-shrink-0 select-none">
                        <span role="img" aria-label="file icon">
                          {iconEmoji}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-sm font-semibold text-[#111827] truncate hover:text-[#3157FF] transition-colors"
                          title={doc.name}
                        >
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#667085]">
                          <span>
                            {format(new Date(doc.created_at), 'dd MMM yyyy')}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Badge variant={badgeVariant} size="sm">
                        {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 mt-3 mb-4">
                    {doc.description || (
                      <span className="text-gray-400 italic">No description provided</span>
                    )}
                  </p>
                </div>

                {/* Footer: Uploaded by & Download button */}
                <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 min-w-0 text-xs text-[#667085]">
                    <span className="flex-shrink-0">Uploaded by:</span>
                    <span className="font-medium text-[#111827] truncate">
                      {uploaderName}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {uploaderRole}
                    </span>
                  </div>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3157FF] bg-[#EFF4FF] hover:bg-[#dbe7ff] rounded-lg transition-colors flex-shrink-0"
                    title={`Download ${doc.name}`}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upload Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Upload Document"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="Document Name"
            placeholder="e.g., Lease Renewal Agreement 2026.pdf"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              if (formError) setFormError('');
            }}
            error={formError}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Category <span className="text-[#F04438]">*</span>
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as Document['category'])}
              className="block w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#3157FF] focus:ring-2 focus:ring-[#EFF4FF] transition-colors"
            >
              <option value="agreement">Agreement</option>
              <option value="identity">Identity</option>
              <option value="receipt">Receipt</option>
              <option value="inspection">Inspection</option>
              <option value="general">General</option>
              <option value="notice">Notice</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              placeholder="Add key notes or context regarding this document..."
              className="block w-full rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#3157FF] focus:ring-2 focus:ring-[#EFF4FF] transition-colors resize-none"
            />
          </div>

          {/* Simulated File Selection */}
          <div className="border border-dashed border-[#E4E7EC] rounded-lg p-4 text-center bg-[#F7F8FA] hover:bg-gray-100/80 transition-colors">
            <input
              type="file"
              id="file-select-input"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (!formName) {
                    setFormName(file.name);
                  }
                  if (formError) setFormError('');
                }
              }}
            />
            <label
              htmlFor="file-select-input"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <FileUp className="w-7 h-7 text-[#3157FF] mb-1.5" />
              <span className="text-xs font-semibold text-[#3157FF]">
                Choose file from computer (Demo)
              </span>
              <span className="text-[11px] text-[#667085] mt-0.5">
                PDF, PNG, JPG, or DOC up to 10MB
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E4E7EC]">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
