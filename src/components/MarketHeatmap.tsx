import React from 'react';
import { StockItem } from '../types';

interface MarketHeatmapProps {
  onSelectStock: (stock: StockItem) => void;
  stocks: StockItem[];
}

interface HeatmapSector {
  name: string;
  weight: string; // e.g. "32% S&P"
  items: {
    symbol: string;
    name: string;
    change: number;
    marketCap: string;
    size: 'large' | 'medium' | 'small';
  }[];
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  onSelectStock,
  stocks
}) => {
  const sectors: HeatmapSector[] = [
    {
      name: 'Technology',
      weight: '31.4%',
      items: [
        { symbol: 'NVDA', name: 'NVIDIA', change: 2.45, marketCap: '$2.1T', size: 'large' },
        { symbol: 'MSFT', name: 'Microsoft', change: 0.92, marketCap: '$3.1T', size: 'large' },
        { symbol: 'AAPL', name: 'Apple', change: -0.85, marketCap: '$2.7T', size: 'large' },
        { symbol: 'MU', name: 'Micron', change: 5.12, marketCap: '$127B', size: 'medium' },
        { symbol: 'AVGO', name: 'Broadcom', change: 3.10, marketCap: '$640B', size: 'medium' },
        { symbol: 'AMD', name: 'AMD', change: 2.80, marketCap: '$260B', size: 'small' },
      ]
    },
    {
      name: 'Communication Services',
      weight: '9.8%',
      items: [
        { symbol: 'META', name: 'Meta Platforms', change: 1.15, marketCap: '$1.2T', size: 'large' },
        { symbol: 'GOOGL', name: 'Alphabet', change: -0.45, marketCap: '$1.9T', size: 'large' },
        { symbol: 'NFLX', name: 'Netflix', change: 1.85, marketCap: '$270B', size: 'medium' },
      ]
    },
    {
      name: 'Consumer Cyclical',
      weight: '10.5%',
      items: [
        { symbol: 'AMZN', name: 'Amazon', change: 1.64, marketCap: '$1.8T', size: 'large' },
        { symbol: 'TSLA', name: 'Tesla', change: 3.40, marketCap: '$697B', size: 'large' },
        { symbol: 'HD', name: 'Home Depot', change: -0.20, marketCap: '$340B', size: 'medium' },
      ]
    },
    {
      name: 'Healthcare',
      weight: '12.1%',
      items: [
        { symbol: 'LLY', name: 'Eli Lilly', change: 3.15, marketCap: '$745B', size: 'large' },
        { symbol: 'UNH', name: 'UnitedHealth', change: 0.75, marketCap: '$460B', size: 'medium' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', change: -0.35, marketCap: '$380B', size: 'medium' },
      ]
    },
    {
      name: 'Financials',
      weight: '12.8%',
      items: [
        { symbol: 'JPM', name: 'JPMorgan Chase', change: 1.25, marketCap: '$570B', size: 'large' },
        { symbol: 'BAC', name: 'Bank of America', change: 0.90, marketCap: '$290B', size: 'medium' },
        { symbol: 'GS', name: 'Goldman Sachs', change: 1.45, marketCap: '$140B', size: 'small' },
      ]
    },
    {
      name: 'Energy',
      weight: '4.2%',
      items: [
        { symbol: 'XOM', name: 'Exxon Mobil', change: 1.80, marketCap: '$460B', size: 'medium' },
        { symbol: 'CVX', name: 'Chevron', change: 1.10, marketCap: '$290B', size: 'medium' },
      ]
    }
  ];

  const getHeatmapColor = (change: number) => {
    if (change >= 3) return 'bg-[#089981] hover:bg-[#089981]/90 text-white';
    if (change >= 1) return 'bg-[#089981]/80 hover:bg-[#089981] text-white';
    if (change > 0) return 'bg-[#089981]/50 hover:bg-[#089981]/70 text-white';
    if (change === 0) return 'bg-[#313441] text-[#dfe2f2]';
    if (change > -1) return 'bg-[#F23645]/50 hover:bg-[#F23645]/70 text-white';
    if (change > -3) return 'bg-[#F23645]/80 hover:bg-[#F23645] text-white';
    return 'bg-[#F23645] hover:bg-[#F23645]/90 text-white';
  };

  const handleBlockClick = (sym: string) => {
    const found = stocks.find((s) => s.symbol === sym);
    if (found) {
      onSelectStock(found);
    } else {
      // Fallback
      onSelectStock(stocks[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-headline text-lg sm:text-xl font-bold text-[#dfe2f2]">
          S&P 500 Market Map (Sector Performance)
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#F23645] rounded-xs" /> Bearish</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#313441] rounded-xs" /> Neutral</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#089981] rounded-xs" /> Bullish</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sectors.map((sector) => (
          <div
            key={sector.name}
            className="bg-[#1b1f2b] border border-[#2A2E39] rounded-xl p-3.5 space-y-2.5 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#dfe2f2] font-headline">{sector.name}</span>
              <span className="text-[#8d90a2] font-mono">{sector.weight}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {sector.items.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => handleBlockClick(item.symbol)}
                  className={`p-2.5 rounded-lg flex flex-col justify-between transition-all duration-150 cursor-pointer text-left shadow-xs ${getHeatmapColor(
                    item.change
                  )} ${item.size === 'large' ? 'col-span-2 row-span-1' : 'col-span-1'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs sm:text-sm font-mono">{item.symbol}</span>
                    <span className="text-[10px] opacity-80 font-mono hidden sm:inline">{item.marketCap}</span>
                  </div>
                  <div className="mt-1">
                    <span className="font-mono text-xs font-bold block">
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
