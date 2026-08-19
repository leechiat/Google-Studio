import React from 'react';
import { AssetCategory } from '../types';

interface NavPillTabsProps {
  activeCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
}

export const NavPillTabs: React.FC<NavPillTabsProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  const pills: { id: AssetCategory; label: string }[] = [
    { id: 'us-stocks', label: 'US stocks' },
    { id: 'world-stocks', label: 'World stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'government-bonds', label: 'Government bonds' },
    { id: 'corporate-bonds', label: 'Corporate bonds' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'economy', label: 'Economy' },
  ];

  return (
    <nav 
      aria-label="Market Categories" 
      className="sticky top-16 z-30 bg-[#0f131e]/90 backdrop-blur-md border-b border-[#2A2E39] px-4 sm:px-6 lg:px-8 py-3 flex overflow-x-auto gap-2 hide-scrollbar items-center"
    >
      {pills.map((pill) => {
        const isActive = activeCategory === pill.id;
        return (
          <button
            key={pill.id}
            id={`nav-pill-${pill.id}`}
            onClick={() => onSelectCategory(pill.id)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all font-medium cursor-pointer ${
              isActive
                ? 'bg-[#2962ff] text-white font-semibold shadow-xs shadow-[#2962ff]/30'
                : 'bg-[#1b1f2b] hover:bg-[#262a35] text-[#c3c5d8] hover:text-[#dfe2f2] border border-[#2A2E39]'
            }`}
          >
            {pill.label}
          </button>
        );
      })}
    </nav>
  );
};
