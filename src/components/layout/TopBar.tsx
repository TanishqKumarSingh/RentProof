import React from 'react';
import { Menu, Bell, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  
  // Very basic route-to-title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    const name = path.substring(1);
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <header className="h-16 bg-white border-b border-[#E4E7EC] flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-[#667085] hover:text-[#111827] focus:outline-none p-1 rounded-md hover:bg-gray-50"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-[#111827]">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative text-[#667085] hover:text-[#111827] transition-colors p-1 rounded-full hover:bg-gray-50">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#F04438] rounded-full border border-white"></span>
        </button>

        <div className="h-8 w-px bg-[#E4E7EC] hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-[#111827]">Sarah Jennings</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#667085]">Tenant</span>
              <CheckCircle size={12} className="text-[#12B76A]" />
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-[#3157FF] text-white flex items-center justify-center font-semibold shadow-sm border-2 border-[#EFF4FF]">
            SJ
          </div>
        </div>
      </div>
    </header>
  );
};
