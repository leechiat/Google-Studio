import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCcw, 
  Star, 
  DollarSign, 
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { UserPosition, TradeOrder, StockItem } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  positions: UserPosition[];
  tradeHistory: TradeOrder[];
  watchlist: string[];
  allStocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onResetAccount: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  userBalance,
  positions,
  tradeHistory,
  watchlist,
  allStocks,
  onSelectStock,
  onResetAccount
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'watchlist' | 'history'>('positions');

  if (!isOpen) return null;

  // Calculate total portfolio value
  const totalHoldingsValue = positions.reduce((acc, pos) => {
    return acc + (pos.shares * pos.currentPrice);
  }, 0);

  const portfolioTotal = userBalance + totalHoldingsValue;
  const initialCapital = 100000;
  const overallPnL = portfolioTotal - initialCapital;
  const overallPnLPct = (overallPnL / initialCapital) * 100;

  const watchlistedStocks = allStocks.filter((s) => watchlist.includes(s.symbol));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#1b1f2b] border border-[#2A2E39] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 text-[#dfe2f2]">
        {/* Header */}
        <div className="sticky top-0 bg-[#1b1f2b]/95 backdrop-blur-md px-6 py-4 border-b border-[#2A2E39] flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2962ff] flex items-center justify-center text-white font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-headline text-white">Trading Portfolio & Account</h2>
              <p className="text-xs text-[#8d90a2]">Institutional Paper Trading Account (Tier 1)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetAccount}
              className="px-3 py-1.5 bg-[#262a35] hover:bg-[#313441] text-[#dfe2f2] text-xs font-semibold rounded-lg border border-[#434656]/50 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset balance to $100,000"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset ($100k)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8d90a2] hover:text-white rounded-lg hover:bg-[#262a35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portfolio Stats Bar */}
        <div className="p-6 bg-[#171b26] border-b border-[#2A2E39] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-[#8d90a2]">Net Portfolio Value</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              ${portfolioTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs font-mono font-semibold mt-0.5 ${overallPnL >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
              {overallPnL >= 0 ? '+' : ''}${overallPnL.toFixed(2)} ({overallPnL >= 0 ? '+' : ''}{overallPnLPct.toFixed(2)}%)
            </div>
          </div>

          <div>
            <span className="text-xs text-[#8d90a2]">Available Cash (Buying Power)</span>
            <div className="text-xl font-bold font-mono text-white mt-1">
              ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-[#089981]">Instant Execution Ready</span>
          </div>

          <div>
            <span className="text-xs text-[#8d90a2]">Invested Equities</span>
            <div className="text-xl font-bold font-mono text-white mt-1">
              ${totalHoldingsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-[#8d90a2]">{positions.length} Active Positions</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#2A2E39] flex gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('positions')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'positions'
                ? 'border-[#2962ff] text-[#b6c4ff] font-semibold'
                : 'border-transparent text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            Holdings ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'watchlist'
                ? 'border-[#2962ff] text-[#b6c4ff] font-semibold'
                : 'border-transparent text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#2962ff] text-[#b6c4ff] font-semibold'
                : 'border-transparent text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            Order Fills ({tradeHistory.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {/* Holdings */}
          {activeTab === 'positions' && (
            <div className="space-y-3">
              {positions.length === 0 ? (
                <div className="text-center py-10 text-[#8d90a2]">
                  <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold text-[#dfe2f2]">No open positions</p>
                  <p className="text-xs mt-1">Click on any stock (e.g. NVDA, AAPL) to simulate a buy order.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#2A2E39] text-xs font-semibold text-[#8d90a2]">
                        <th className="pb-3">Asset</th>
                        <th className="pb-3 text-right">Shares</th>
                        <th className="pb-3 text-right">Avg Cost</th>
                        <th className="pb-3 text-right">Current</th>
                        <th className="pb-3 text-right">Total Value</th>
                        <th className="pb-3 text-right">Unrealized P&L</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2E39]/60">
                      {positions.map((pos) => {
                        const marketVal = pos.shares * pos.currentPrice;
                        const pnl = (pos.currentPrice - pos.avgBuyPrice) * pos.shares;
                        const pnlPct = ((pos.currentPrice - pos.avgBuyPrice) / pos.avgBuyPrice) * 100;
                        return (
                          <tr key={pos.symbol} className="hover:bg-[#262a35] transition-colors">
                            <td className="py-3 font-semibold text-white">
                              <span className="px-2 py-0.5 bg-[#262a35] rounded font-mono text-xs text-[#2962ff] mr-2">
                                {pos.symbol}
                              </span>
                              {pos.name}
                            </td>
                            <td className="py-3 text-right font-mono">{pos.shares}</td>
                            <td className="py-3 text-right font-mono">${pos.avgBuyPrice.toFixed(2)}</td>
                            <td className="py-3 text-right font-mono">${pos.currentPrice.toFixed(2)}</td>
                            <td className="py-3 text-right font-mono font-semibold">${marketVal.toFixed(2)}</td>
                            <td className={`py-3 text-right font-mono font-semibold ${pnl >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnl >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Watchlist */}
          {activeTab === 'watchlist' && (
            <div className="space-y-2">
              {watchlistedStocks.length === 0 ? (
                <div className="text-center py-10 text-[#8d90a2]">
                  <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-base font-semibold text-[#dfe2f2]">Your watchlist is empty</p>
                  <p className="text-xs mt-1">Click the star icon on any asset detail page to track it here.</p>
                </div>
              ) : (
                watchlistedStocks.map((stk) => (
                  <div
                    key={stk.symbol}
                    onClick={() => {
                      onSelectStock(stk);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3.5 bg-[#171b26] hover:bg-[#262a35] border border-[#2A2E39] rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2962ff]/15 text-[#2962ff] flex items-center justify-center font-bold text-xs">
                        {stk.symbol}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{stk.name}</div>
                        <div className="text-xs text-[#8d90a2]">{stk.exchange}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-white">${stk.price.toFixed(2)}</div>
                      <div className={`text-xs font-mono font-semibold ${stk.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {stk.change >= 0 ? '+' : ''}{stk.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Order Fills */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {tradeHistory.length === 0 ? (
                <div className="text-center py-10 text-[#8d90a2]">
                  <p className="text-sm">No executed orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2A2E39]">
                  {tradeHistory.map((order) => (
                    <div key={order.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                          order.type === 'BUY' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#F23645]/20 text-[#F23645]'
                        }`}>
                          {order.type}
                        </span>
                        <span className="font-bold text-white">{order.symbol}</span>
                        <span className="text-[#8d90a2]">({order.shares} units @ ${order.price.toFixed(2)})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-semibold text-white">${order.total.toFixed(2)}</span>
                        <div className="text-[10px] text-[#8d90a2]">{order.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
