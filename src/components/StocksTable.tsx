import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Layers, TrendingUp, Sparkles, ArrowUpDown, Search, Star } from 'lucide-react';
import { StockItem } from '../types';

interface StocksTableProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onSeeAll: () => void;
  categoryLabel?: string;
  watchlist?: string[];
  onToggleWatchlist?: (symbol: string) => void;
}

export const StocksTable: React.FC<StocksTableProps> = ({
  stocks,
  onSelectStock,
  onSeeAll,
  categoryLabel = 'US stocks',
  watchlist = [],
  onToggleWatchlist
}) => {
  const [filter, setFilter] = useState<'volume' | 'gainers' | 'losers' | 'all'>('volume');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'symbol' | 'price' | 'change' | 'volume'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  let filtered = stocks.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filter === 'gainers') {
    filtered = filtered.filter((s) => s.change > 0).sort((a, b) => b.change - a.change);
  } else if (filter === 'losers') {
    filtered = filtered.filter((s) => s.change < 0).sort((a, b) => a.change - b.change);
  } else if (filter === 'volume') {
    // Top volume
    filtered = filtered.slice(0, 7);
  }

  // Sort logic
  filtered = filtered.sort((a, b) => {
    let comparison = 0;
    if (sortField === 'symbol') comparison = a.symbol.localeCompare(b.symbol);
    else if (sortField === 'price') comparison = a.price - b.price;
    else if (sortField === 'change') comparison = a.change - b.change;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: 'symbol' | 'price' | 'change' | 'volume') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Subheader & Pro Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
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
            <button
              onClick={() => setFilter('losers')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'losers' ? 'bg-[#2962ff] text-white font-medium' : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              Losers
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* In-table quick search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8d90a2]" />
            <input
              type="text"
              placeholder="Filter list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#171b26] border border-[#2A2E39] rounded-lg py-1 pl-8 pr-3 text-xs text-white placeholder:text-[#8d90a2] focus:outline-none focus:border-[#2962ff] w-28 sm:w-36 transition-all"
            />
          </div>

          <button
            id="see-all-stocks-btn"
            onClick={onSeeAll}
            className="text-[#2962ff] hover:text-[#b6c4ff] text-xs sm:text-sm font-medium flex items-center gap-1 group cursor-pointer transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stock Table Container */}
      <div className="bg-[#1b1f2b] rounded-xl border border-[#2A2E39] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#171b26] border-b border-[#2A2E39]">
              <th 
                onClick={() => toggleSort('symbol')}
                className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <span className="flex items-center gap-1">
                  Symbol <ArrowUpDown className="w-3 h-3 opacity-60" />
                </span>
              </th>
              <th 
                onClick={() => toggleSort('price')}
                className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider text-right cursor-pointer hover:text-white"
              >
                <span className="flex items-center justify-end gap-1">
                  Price <ArrowUpDown className="w-3 h-3 opacity-60" />
                </span>
              </th>
              <th 
                onClick={() => toggleSort('change')}
                className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider text-right cursor-pointer hover:text-white"
              >
                <span className="flex items-center justify-end gap-1">
                  Change <ArrowUpDown className="w-3 h-3 opacity-60" />
                </span>
              </th>
              <th 
                onClick={() => toggleSort('volume')}
                className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider text-right hidden sm:table-cell cursor-pointer hover:text-white"
              >
                <span className="flex items-center justify-end gap-1">
                  Volume <ArrowUpDown className="w-3 h-3 opacity-60" />
                </span>
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-[#B2B5BE] uppercase tracking-wider text-right hidden md:table-cell">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2E39]">
            {filtered.map((stock) => {
              const isPositive = stock.change >= 0;
              const isWatched = watchlist.includes(stock.symbol);

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
                      <div className="w-9 h-9 rounded-lg bg-[#2962ff]/15 text-[#2962ff] border border-[#2962ff]/20 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform shrink-0">
                        {stock.symbol.slice(0, 4)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm sm:text-base font-semibold text-[#dfe2f2] group-hover:text-white transition-colors truncate">
                          {stock.name}
                        </div>
                        <div className="font-mono text-xs text-[#B2B5BE] flex items-center gap-2">
                          <span>{stock.exchange}</span>
                          <span className="hidden sm:inline">• {stock.marketCap}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 sm:px-6 text-right font-mono text-sm sm:text-base font-semibold text-[#dfe2f2]">
                    ${stock.price.toFixed(2)}
                  </td>

                  {/* Change */}
                  <td className="py-4 px-4 sm:px-6 text-right font-mono text-sm sm:text-base font-semibold">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                        isPositive 
                          ? 'text-[#089981] bg-[#089981]/10' 
                          : 'text-[#F23645] bg-[#F23645]/10'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stock.change.toFixed(2)}%
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-4 px-4 sm:px-6 text-right font-mono text-sm text-[#c3c5d8] hidden sm:table-cell">
                    {stock.volume}
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-4 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {onToggleWatchlist && (
                        <button
                          onClick={() => onToggleWatchlist(stock.symbol)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isWatched ? 'text-amber-400 border-amber-500/30' : 'text-[#8d90a2] border-transparent hover:text-white'
                          }`}
                          title="Watchlist"
                        >
                          <Star className={`w-3.5 h-3.5 ${isWatched ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectStock(stock)}
                        className="px-2.5 py-1 bg-[#2962ff]/15 hover:bg-[#2962ff] text-[#b6c4ff] hover:text-white border border-[#2962ff]/30 text-xs font-semibold rounded-lg transition-all"
                      >
                        Trade
                      </button>
                    </div>
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
