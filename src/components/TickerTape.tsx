import React from 'react';
import { ArrowUp, ArrowDown, Radio } from 'lucide-react';
import { StockItem, MarketIndex } from '../types';

interface TickerTapeProps {
  indices: MarketIndex[];
  stocks: StockItem[];
  onSelectAsset: (asset: StockItem | MarketIndex) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  indices,
  stocks,
  onSelectAsset
}) => {
  // Combine indices and popular stocks for ticker tape
  const items = [
    ...indices.map(i => ({ 
      id: i.ticker, 
      symbol: i.ticker, 
      name: i.name, 
      price: i.value, 
      change: i.change, 
      isBullish: i.isBullish,
      isIndex: true,
      raw: i 
    })),
    ...stocks.slice(0, 10).map(s => ({
      id: s.symbol,
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      change: s.change,
      isBullish: s.change >= 0,
      isIndex: false,
      raw: s
    }))
  ];

  // Duplicate for smooth seamless loop
  const tapeList = [...items, ...items];

  return (
    <div className="w-full bg-[#0a0e19] border-b border-[#2A2E39] overflow-hidden py-1.5 px-4 flex items-center text-xs select-none">
      {/* Live Badge */}
      <div className="flex items-center gap-1.5 pr-4 border-r border-[#2A2E39] shrink-0 text-[#089981] font-mono font-semibold">
        <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping" />
        <span className="hidden sm:inline">LIVE FEED</span>
      </div>

      {/* Marquee Container */}
      <div className="flex overflow-x-auto hide-scrollbar whitespace-nowrap gap-6 pl-4 items-center">
        {tapeList.map((item, idx) => {
          const isPos = item.isBullish;
          return (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => onSelectAsset(item.raw as any)}
              className="inline-flex items-center gap-2 hover:bg-[#1b1f2b] px-2 py-0.5 rounded transition-colors cursor-pointer group"
            >
              <span className="font-bold text-[#dfe2f2] group-hover:text-[#2962ff] transition-colors font-mono">
                {item.symbol}
              </span>
              <span className="font-mono text-[#dfe2f2]">
                {item.isIndex
                  ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : `$${item.price.toFixed(2)}`}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-mono font-semibold ${
                  isPos ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPos ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {isPos ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
