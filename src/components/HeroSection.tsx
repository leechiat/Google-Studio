import React, { useState } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface HeroSectionProps {
  onOpenSearch: () => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenSearch,
  selectedRegion,
  onSelectRegion
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const regions = [
    { id: 'everywhere', label: 'Markets, everywhere' },
    { id: 'us', label: 'Markets, United States' },
    { id: 'europe', label: 'Markets, Europe' },
    { id: 'asia', label: 'Markets, Asia-Pacific' },
    { id: 'crypto', label: 'Markets, Digital Assets' }
  ];

  const currentLabel = regions.find(r => r.id === selectedRegion)?.label || 'Markets, everywhere';

  return (
    <section className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#171b26] border-b border-[#2A2E39] relative overflow-hidden">
      {/* Subtle radial financial gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2962ff]/10 via-transparent to-[#20a28a]/5 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2962ff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-3xl text-center space-y-6 w-full">
        {/* Title with dropdown */}
        <div className="relative">
          <button
            id="hero-region-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#dfe2f2] flex items-center justify-center gap-2 sm:gap-3 hover:text-white transition-colors cursor-pointer group"
          >
            <span>{currentLabel}</span>
            <ChevronDown className={`w-6 h-6 sm:w-8 sm:h-8 text-[#c3c5d8] group-hover:text-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 bg-[#1b1f2b] border border-[#2A2E39] rounded-xl shadow-2xl p-1.5 z-30 space-y-1">
                {regions.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      onSelectRegion(reg.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                      selectedRegion === reg.id
                        ? 'bg-[#2962ff] text-white font-semibold'
                        : 'text-[#dfe2f2] hover:bg-[#262a35]'
                    }`}
                  >
                    <span>{reg.label.replace('Markets, ', '')}</span>
                    {selectedRegion === reg.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Big Search Input with shortcut hint */}
        <div className="w-full max-w-xl relative group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8d90a2] group-hover:text-[#2962ff] transition-colors pointer-events-none" />
          <input
            id="hero-search-input"
            onClick={onOpenSearch}
            readOnly
            className="w-full bg-[#1b1f2b] border border-[#2A2E39] rounded-full py-3.5 pl-12 pr-28 text-base text-[#dfe2f2] placeholder:text-[#8d90a2] focus:outline-none focus:border-[#2962ff] focus:ring-2 focus:ring-[#2962ff]/20 transition-all shadow-md cursor-pointer hover:border-[#434656]"
            placeholder="Search markets (Ctrl+K)"
            type="text"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#262a35] border border-[#434656]/50 rounded-full text-xs font-mono text-[#8d90a2] pointer-events-none">
            <span>⌘K / Ctrl+K</span>
          </div>
        </div>
      </div>
    </section>
  );
};
