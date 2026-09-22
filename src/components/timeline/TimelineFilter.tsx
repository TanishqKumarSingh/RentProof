import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

export interface TimelineFilterProps {
  filters: {
    type: string;
    search: string;
    startDate: string;
    endDate: string;
  };
  onChange: (filters: any) => void;
}

export function TimelineFilter({ filters, onChange }: TimelineFilterProps) {
  const types = ['All', 'Agreement', 'Payment', 'Maintenance', 'Inspection', 'Document'];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E4E7EC] mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onChange({ ...filters, type: type === 'All' ? '' : type.toLowerCase() })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (filters.type === '' && type === 'All') || filters.type === type.toLowerCase()
                ? 'bg-[#3157FF] text-white'
                : 'bg-[#F7F8FA] text-[#667085] hover:bg-[#E4E7EC]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon={<Search size={18} />}
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex gap-4 sm:w-auto w-full">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
          />
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
