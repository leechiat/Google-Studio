import React, { useState, useEffect } from 'react';
import { Search, User, Menu, Radio, LayoutGrid, TableProperties, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenCommunity: () => void;
  onToggleMobileSidebar: () => void;
  onGetStarted: () => void;
  viewMode: 'table' | 'heatmap';
  onToggleViewMode: (mode: 'table' | 'heatmap') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAccount,
  onOpenCommunity,
  onToggleMobileSidebar,
  onGetStarted,
  viewMode,
  onToggleViewMode
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const estTime = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setTimeStr(estTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#0f131e]/85 backdrop-blur-xl border-b border-[#2A2E39] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-[#8d90a2] hover:text-white rounded-lg hover:bg-[#262a35] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8d90a2] group-hover:text-[#2962ff] transition-colors pointer-events-none" />
          <input
            id="header-search-input"
            onClick={onOpenSearch}
            readOnly
            className="w-full bg-[#171b26] border border-[#2A2E39] rounded-lg py-1.5 pl-10 pr-4 text-sm text-[#dfe2f2] placeholder:text-[#8d90a2] focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-all cursor-pointer hover:border-[#434656]"
            placeholder="Search markets..."
            type="text"
          />
        </div>
      </div>

      {/* Right: Institutional Pro Navigation & Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Live EST Wall-Clock for Pro Traders */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#171b26] border border-[#2A2E39] text-xs font-mono text-[#dfe2f2]">
          <span className="text-[#8d90a2]">EST</span>
          <span className="text-white font-bold">{timeStr || '14:30:00'}</span>
        </div>

        {/* Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#089981]/10 border border-[#089981]/25 text-xs text-[#089981] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
          <span className="hidden lg:inline">NYSE • LIVE</span>
        </div>

        {/* View Mode Toggle: Standard List vs Heatmap */}
        <div className="hidden sm:flex items-center bg-[#171b26] p-0.5 rounded-lg border border-[#2A2E39]">
          <button
            onClick={() => onToggleViewMode('table')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'table' ? 'bg-[#2962ff] text-white shadow-xs' : 'text-[#8d90a2] hover:text-white'
            }`}
            title="Table View"
          >
            <TableProperties className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleViewMode('heatmap')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'heatmap' ? 'bg-[#2962ff] text-white shadow-xs' : 'text-[#8d90a2] hover:text-white'
            }`}
            title="Sector Heatmap"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-5">
          <button 
            onClick={() => onGetStarted()}
            className="text-sm font-medium text-[#c3c5d8] hover:text-[#dfe2f2] transition-colors cursor-pointer"
          >
            Products
          </button>
          <button 
            onClick={onOpenCommunity}
            className="text-sm font-medium text-[#c3c5d8] hover:text-[#dfe2f2] transition-colors cursor-pointer"
          >
            Community
          </button>
          <button 
            onClick={() => onGetStarted()}
            className="text-sm font-medium text-[#c3c5d8] hover:text-[#dfe2f2] transition-colors cursor-pointer"
          >
            Broker
          </button>
        </nav>

        <button
          id="header-get-started-btn"
          onClick={onGetStarted}
          className="bg-[#2962ff] hover:bg-[#2962ff]/90 active:scale-95 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm shadow-[#2962ff]/30 cursor-pointer whitespace-nowrap"
        >
          Get Started
        </button>

        <button
          id="header-profile-avatar"
          onClick={onOpenAccount}
          className="w-8 h-8 rounded-full bg-[#b6c4ff] hover:ring-2 hover:ring-[#2962ff] flex items-center justify-center text-[#002780] transition-all cursor-pointer"
          aria-label="Account details"
        >
          <User className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};
