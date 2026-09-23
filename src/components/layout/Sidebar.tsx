import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Clock,
  CreditCard,
  Wrench,
  ClipboardCheck,
  FileText,
  Camera,
  BarChart3,
  Shield,
  Bot
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Timeline', path: '/timeline', icon: Clock },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Inspections', path: '/inspections', icon: ClipboardCheck },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Evidence', path: '/evidence', icon: Camera },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
];

export interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
  onAIClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate, onAIClick }) => {
  return (
    <div className={clsx("flex flex-col h-full bg-white border-r border-[#E4E7EC]", className)}>
      <div className="p-6 flex items-center gap-2">
        <div className="bg-[#EFF4FF] p-1.5 rounded-lg text-[#3157FF]">
          <Shield size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-[#3157FF] tracking-tight">RentProof</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
              isActive
                ? "bg-[#EFF4FF] text-[#3157FF]"
                : "text-[#667085] hover:bg-gray-50 hover:text-[#111827]",
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#3157FF] rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <item.icon size={20} className={clsx(isActive ? "text-[#3157FF]" : "text-[#667085] group-hover:text-[#111827]")} />
                <span className="flex-1">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-[#E4E7EC]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAIClick}
          className="w-full flex items-center justify-center gap-2 bg-[#F7F8FA] hover:bg-[#EFF4FF] hover:text-[#3157FF] text-[#111827] border border-[#E4E7EC] hover:border-[#3157FF] transition-colors rounded-lg py-2.5 px-4 text-sm font-medium shadow-sm group"
        >
          <Bot size={18} className="text-[#3157FF] group-hover:animate-pulse" />
          <span>AI Assistant</span>
        </motion.button>
      </div>
    </div>
  );
};
