import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Layers, TrendingUp, Sparkles } from 'lucide-react';
import { StockItem } from '../types';

interface StocksTableProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onSeeAll: () => void;
  categoryLabel?: string;
}

export const StocksTable: React.FC<StocksTableProps> = ({
  stocks,
  onSelectStock,
  onSeeAll,
  categoryLabel = 'US stocks'
}) => {
  const [filter, setFilter] = useState<'volume' | 'gainers' | 'all'>('volume');

  let displayedStocks = [...stocks];
  if (filter === 'gainers') {
    displayedStocks = displayedStocks.sort((a, b) => b.change - a.change);
  } else if (filter === 'volume') {
    // Keep high volume order
    displayedStocks = displayedStocks.slice(0, 6);
  }

  return (
    <div className="space-y-4">
      {/* Table Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h3 className="font-headline text-lg sm:text-xl font-bold text-[#dfe2f2]">
            Highest volume stocks
          </h3>
          <div className="flex items-center bg-[#171b26] p-0.5 rounded-lg border border-[#2A2E39] text-xs">
            <button
              onClick={() => setFilter('volume')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'volume' ? 'bg-[#2962ff] text-white font-medium' : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              Volume
            </button>
            <button
              onClick={() => setFilter('gainers')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'gainers' ? 'bg-[#2962ff] text-white font-medium' : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              Gainers
            </button>
          </div>
        </div>

        <button
          id="see-all-stocks-btn"
          onClick={onSeeAll}
          className="text-[#2962ff] hover:text-[#b6c4ff] text-sm font-medium flex items-center gap-1 group self-start sm:self-auto cursor-pointer transition-colors"
        >
          <span>See all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Stock Table Container */}
      <div className="bg-[#1b1f2b] rounded-xl border border-[#2A2E39] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#171b26] border-b border-[#2A2E39]">
              <th className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider">
                Symbol
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider text-right">
                Price
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider text-right">
                Change
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider text-right hidden sm:table-cell">
                Volume
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2E39]">
            {displayedStocks.map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <tr
                  key={stock.symbol}
                  id={`stock-row-${stock.symbol}`}
                  onClick={() => onSelectStock(stock)}
                  className="hover:bg-[#262a35] transition-colors cursor-pointer group"
                >
                  {/* Symbol & Name */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-[#2962ff]/15 text-[#2962ff] border border-[#2962ff]/20 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                        {stock.symbol.slice(0, 4)}
                      </div>
                      <div>
                        <div className="text-sm sm:text-base font-semibold text-[#dfe2f2] group-hover:text-white transition-colors">
                          {stock.name}
                        </div>
                        <div className="font-mono-numbers text-xs text-[#B2B5BE]">
                          {stock.exchange}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 sm:px-6 text-right font-mono-numbers text-sm sm:text-base font-semibold text-[#dfe2f2]">
                    ${stock.price.toFixed(2)}
                  </td>

                  {/* Change */}
                  <td className="py-4 px-4 sm:px-6 text-right font-mono-numbers text-sm sm:text-base font-semibold">
                    <span
                      className={`inline-flex items-center gap-0.5 ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stock.change.toFixed(2)}%
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-4 px-4 sm:px-6 text-right font-mono-numbers text-sm text-[#c3c5d8] hidden sm:table-cell">
                    {stock.volume}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
