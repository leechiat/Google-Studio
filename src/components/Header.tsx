import React from 'react';
import { Search, User, Menu, Radio } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenCommunity: () => void;
  onToggleMobileSidebar: () => void;
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAccount,
  onOpenCommunity,
  onToggleMobileSidebar,
  onGetStarted
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#0f131e]/85 backdrop-blur-xl border-b border-[#2A2E39] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Toggle & Search Bar */}
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

      {/* Right Navigation & Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#089981]/10 border border-[#089981]/25 text-xs text-[#089981] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
          <span>NYSE • LIVE</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
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
          className="bg-[#2962ff] hover:bg-[#2962ff]/90 active:scale-95 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-[#2962ff]/30 cursor-pointer whitespace-nowrap"
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
