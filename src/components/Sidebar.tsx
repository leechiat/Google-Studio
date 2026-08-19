import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Coins, 
  Clock, 
  ArrowLeftRight, 
  Landmark, 
  User as UserIcon,
  Activity,
  X
} from 'lucide-react';
import { SidebarTab } from '../types';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  onOpenAccount: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAccount,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'indices', label: 'Indices', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'stocks', label: 'Stocks', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'crypto', label: 'Crypto', icon: <Coins className="w-5 h-5" /> },
    { id: 'futures', label: 'Futures', icon: <Clock className="w-5 h-5" /> },
    { id: 'forex', label: 'Forex', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: 'bonds', label: 'Bonds', icon: <Landmark className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-[#171b26] z-50 flex flex-col border-r border-[#2A2E39] transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2962ff] rounded flex items-center justify-center text-white shadow-sm shadow-[#2962ff]/30">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight text-[#dfe2f2]">
              MARKETS
            </span>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-[#8d90a2] hover:text-white p-1 rounded-md"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-[#313441] text-[#b6c4ff] border-r-2 border-[#2962ff] shadow-inner font-semibold'
                    : 'text-[#c3c5d8] hover:bg-[#262a35] hover:text-[#dfe2f2]'
                }`}
              >
                <span className={`mr-3 transition-colors ${isActive ? 'text-[#2962ff]' : 'text-[#8d90a2] group-hover:text-[#dfe2f2]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Account item */}
        <div className="px-5 py-4 border-t border-[#2A2E39]">
          <button
            id="sidebar-account-btn"
            onClick={onOpenAccount}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#262a35] transition-colors text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-[#2962ff] flex items-center justify-center text-white font-medium text-xs shadow-xs group-hover:scale-105 transition-transform">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#dfe2f2] truncate">Account</p>
              <p className="text-xs text-[#8d90a2] truncate">Paper Trading ($100k)</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
