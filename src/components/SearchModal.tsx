import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, DollarSign, Layers, ArrowRight } from 'lucide-react';
import { StockItem, MarketIndex } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  indices: MarketIndex[];
  onSelectStock: (stock: StockItem) => void;
  onSelectIndex: (index: MarketIndex) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectStock,
  onSelectIndex
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stocks' | 'indices' | 'crypto' | 'forex'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter stocks & indices
  const normalizedQuery = query.toLowerCase().trim();

  const filteredIndices = indices.filter(
    (idx) =>
      idx.name.toLowerCase().includes(normalizedQuery) ||
      idx.ticker.toLowerCase().includes(normalizedQuery)
  );

  const filteredStocks = stocks.filter((stk) => {
    const matchesQuery =
      stk.name.toLowerCase().includes(normalizedQuery) ||
      stk.symbol.toLowerCase().includes(normalizedQuery) ||
      stk.exchange.toLowerCase().includes(normalizedQuery);

    if (filterType === 'all') return matchesQuery;
    if (filterType === 'stocks') return matchesQuery && stk.category === 'us-stocks';
    if (filterType === 'crypto') return matchesQuery && stk.category === 'crypto';
    if (filterType === 'forex') return matchesQuery && stk.category === 'forex';
    return matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#1b1f2b] border border-[#2A2E39] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 text-[#dfe2f2]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2A2E39] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks, indices, crypto, forex (e.g. NVDA, AAPL, SPX, BTC)..."
            className="w-full bg-transparent text-[#dfe2f2] placeholder:text-[#8d90a2] text-base focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-[#8d90a2] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-[#262a35] text-[#8d90a2] hover:text-white rounded border border-[#434656]/40 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="px-4 py-2 bg-[#171b26] border-b border-[#2A2E39] flex gap-2 overflow-x-auto text-xs hide-scrollbar">
          {(['all', 'stocks', 'indices', 'crypto', 'forex'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1 rounded-full capitalize transition-colors font-medium cursor-pointer ${
                filterType === tab
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#1b1f2b] text-[#8d90a2] hover:text-[#dfe2f2] border border-[#2A2E39]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#2A2E39]/50">
          {/* Indices Match */}
          {filterType !== 'crypto' && filterType !== 'forex' && filteredIndices.length > 0 && (
            <div className="p-2">
              <div className="text-[11px] font-semibold text-[#8d90a2] uppercase tracking-wider mb-1.5 px-2">
                Indices
              </div>
              {filteredIndices.map((idx) => (
                <button
                  key={idx.id}
                  onClick={() => {
                    onSelectIndex(idx);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#262a35] transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx.badgeBgColor}`}>
                      {idx.badgeNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#dfe2f2] group-hover:text-white">
                        {idx.name}
                      </div>
                      <div className="text-xs text-[#8d90a2]">{idx.ticker} • Global Index</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-[#dfe2f2]">
                      {idx.value.toLocaleString()}
                    </div>
                    <div className={`text-xs font-mono font-semibold ${idx.isBullish ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                      {idx.isBullish ? '+' : ''}{idx.change}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Stocks Match */}
          {filteredStocks.length > 0 ? (
            <div className="p-2">
              <div className="text-[11px] font-semibold text-[#8d90a2] uppercase tracking-wider mb-1.5 px-2">
                Securities & Assets
              </div>
              {filteredStocks.map((stk) => (
                <button
                  key={stk.symbol}
                  onClick={() => {
                    onSelectStock(stk);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#262a35] transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2962ff]/15 text-[#2962ff] flex items-center justify-center font-bold text-xs">
                      {stk.symbol.slice(0, 4)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#dfe2f2] group-hover:text-white">
                        {stk.name}
                      </div>
                      <div className="text-xs text-[#8d90a2]">{stk.symbol} • {stk.exchange}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-[#dfe2f2]">
                      ${stk.price.toFixed(2)}
                    </div>
                    <div className={`text-xs font-mono font-semibold ${stk.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                      {stk.change >= 0 ? '+' : ''}{stk.change.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : filteredIndices.length === 0 ? (
            <div className="p-8 text-center text-[#8d90a2]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No markets matching "{query}"</p>
              <p className="text-xs mt-1">Try searching for NVDA, Apple, S&P 500, or Bitcoin</p>
            </div>
          ) : null}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#171b26] border-t border-[#2A2E39] flex items-center justify-between text-xs text-[#8d90a2]">
          <span>Navigation: Click or Enter to view asset</span>
          <span>Powered by Real-Time Markets Engine</span>
        </div>
      </div>
    </div>
  );
};
