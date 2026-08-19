import React, { useState } from 'react';
import { ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { MarketIndex } from '../types';
import { SECONDARY_INDICES } from '../data/mockMarketData';

interface IndicesCardsProps {
  indices: MarketIndex[];
  onSelectIndex: (index: MarketIndex) => void;
  onSelectSecondary: (name: string) => void;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  indices,
  onSelectIndex,
  onSelectSecondary
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 
          id="indices-section-heading"
          onClick={() => onSelectIndex(indices[0])}
          className="font-headline text-2xl sm:text-3xl font-bold text-[#dfe2f2] flex items-center gap-2 group cursor-pointer hover:text-white transition-colors"
        >
          <span>Indices</span>
          <ChevronRight className="w-6 h-6 text-[#c3c5d8] group-hover:translate-x-1 transition-transform" />
        </h2>
      </div>

      {/* Main 3 Indices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indices.map((item) => {
          const isPositive = item.isBullish;
          return (
            <div
              key={item.id}
              id={`index-card-${item.id}`}
              onClick={() => onSelectIndex(item)}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-[#1b1f2b] rounded-xl p-6 hover:bg-[#262a35] transition-all duration-200 cursor-pointer border border-[#2A2E39] group hover:border-[#434656] hover:shadow-lg relative overflow-hidden"
            >
              {/* Card Top Information */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${item.badgeBgColor}`}
                  >
                    {item.badgeNumber}
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-semibold text-[#dfe2f2] group-hover:text-white transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm font-medium text-[#B2B5BE]">{item.ticker}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-numbers text-lg font-semibold text-[#dfe2f2]">
                    {item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div 
                    className={`font-mono-numbers text-sm flex items-center justify-end gap-1 font-semibold ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                    )}
                    <span>{Math.abs(item.change).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Graphic */}
              <div className="h-16 w-full relative pt-2">
                <svg
                  className={`w-full h-full ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area Fill */}
                  <path
                    d={item.fillPath}
                    fill={`url(#grad-${item.id})`}
                    className="transition-opacity duration-300"
                  />

                  {/* Line */}
                  <path
                    d={item.sparklinePath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300 group-hover:stroke-[2.8]"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Indices List */}
      <div className="flex flex-wrap gap-3 pt-1">
        {SECONDARY_INDICES.map((sec, idx) => (
          <button
            key={idx}
            id={`secondary-index-chip-${idx}`}
            onClick={() => onSelectSecondary(sec.name)}
            className="px-4 py-2 bg-[#1b1f2b] rounded-lg text-sm text-[#dfe2f2] hover:bg-[#262a35] transition-all flex items-center gap-2.5 border border-[#2A2E39] hover:border-[#434656] cursor-pointer"
          >
            <span className="font-medium">{sec.name}</span>
            <span 
              className={`font-mono-numbers text-xs font-semibold ${
                sec.isBullish ? 'text-[#089981]' : 'text-[#F23645]'
              }`}
            >
              {sec.change}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
