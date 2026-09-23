import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MaintenanceRequest } from '../../types';

interface CreateMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MaintenanceRequest>) => void;
}

const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Pest Control', 'Appliance', 'General'];
const rooms = ['Living Room', 'Master Bedroom', 'Guest Bedroom', 'Kitchen', 'Master Bathroom', 'Guest Bathroom', 'Balcony', 'Other'];
const priorities: { value: MaintenanceRequest['priority']; label: string; desc: string }[] = [
  { value: 'urgent', label: '🔴 Urgent', desc: 'Safety hazard / no water / no electricity' },
  { value: 'high',   label: '🟠 High',   desc: 'Major inconvenience, needs quick fix' },
  { value: 'medium', label: '🔵 Medium', desc: 'Functional issue, can wait a few days' },
  { value: 'low',    label: '⚪ Low',    desc: 'Cosmetic / minor, no rush' },
];

export const CreateMaintenanceModal: React.FC<CreateMaintenanceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [room, setRoom] = useState('');
  const [priority, setPriority] = useState<MaintenanceRequest['priority']>('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      title,
      description,
      category,
      room: room || null,
      priority,
      status: 'reported',
    });
    setLoading(false);
    setTitle('');
    setDescription('');
    setCategory('General');
    setRoom('');
    setPriority('medium');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC]">
              <h2 className="text-lg font-bold text-[#111827]">Report an Issue</h2>
              <button onClick={onClose} className="text-[#667085] hover:text-[#111827] p-1 rounded-md hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <Input
                label="Issue Title"
                placeholder="e.g. Leaking pipe under kitchen sink"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-[#E4E7EC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3157FF]/20 focus:border-[#3157FF] text-sm resize-none"
                  rows={4}
                  placeholder="Describe the issue in detail — when it started, what you've noticed..."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2.5 border border-[#E4E7EC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3157FF]/20 focus:border-[#3157FF] text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Room</label>
                  <select
                    className="w-full px-4 py-2.5 border border-[#E4E7EC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3157FF]/20 focus:border-[#3157FF] text-sm"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  >
                    <option value="">Select room...</option>
                    {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">Priority</label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        priority === p.value
                          ? 'border-[#3157FF] bg-[#EFF4FF]'
                          : 'border-[#E4E7EC] hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{p.label}</span>
                      <p className="text-[10px] text-[#667085] mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button type="submit" variant="primary" loading={loading} className="flex-1">
                  Submit Report
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
