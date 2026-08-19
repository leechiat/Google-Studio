import React, { useState } from 'react';
import { 
  X, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  TrendingUp, 
  BarChart2, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { StockItem, MarketIndex, UserPosition } from '../types';

interface AssetDetailModalProps {
  item: StockItem | MarketIndex | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  userBalance: number;
  onExecuteTrade: (symbol: string, name: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
  currentPosition?: UserPosition;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  userBalance,
  onExecuteTrade,
  currentPosition
}) => {
  if (!item) return null;

  const isStock = 'price' in item;
  const symbol = isStock ? item.symbol : item.ticker;
  const name = item.name;
  const price = isStock ? item.price : item.value;
  const change = item.change;
  const isPositive = isStock ? item.isBullish : item.isBullish;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  // Generate responsive chart points based on timeframe
  const generateChartPoints = () => {
    const base = price * 0.96;
    const pointsCount = timeframe === '1D' ? 12 : timeframe === '5D' ? 24 : 36;
    const pts = [];
    let cur = base;
    for (let i = 0; i < pointsCount; i++) {
      const delta = (Math.sin(i / 2) * (price * 0.015)) + ((Math.random() - 0.47) * (price * 0.01));
      cur = Math.max(cur + delta, price * 0.85);
      pts.push(cur);
    }
    pts[pts.length - 1] = price; // End at current price
    return pts;
  };

  const chartPoints = generateChartPoints();
  const minVal = Math.min(...chartPoints) * 0.995;
  const maxVal = Math.max(...chartPoints) * 1.005;
  const range = maxVal - minVal || 1;

  // SVG points
  const svgPath = chartPoints
    .map((val, idx) => {
      const x = (idx / (chartPoints.length - 1)) * 100;
      const y = 85 - ((val - minVal) / range) * 70;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const svgArea = `${svgPath} L 100 95 L 0 95 Z`;

  const totalCost = tradeShares * price;

  const handleBuy = () => {
    if (totalCost > userBalance) {
      alert("Insufficient paper trading balance!");
      return;
    }
    onExecuteTrade(symbol, name, 'BUY', tradeShares, price);
    setTradeSuccessMsg(`Successfully bought ${tradeShares} shares of ${symbol}!`);
    setTimeout(() => setTradeSuccessMsg(null), 3000);
  };

  const handleSell = () => {
    if (!currentPosition || currentPosition.shares < tradeShares) {
      alert(`You only hold ${currentPosition?.shares || 0} shares of ${symbol}.`);
      return;
    }
    onExecuteTrade(symbol, name, 'SELL', tradeShares, price);
    setTradeSuccessMsg(`Successfully sold ${tradeShares} shares of ${symbol}!`);
    setTimeout(() => setTradeSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative bg-[#1b1f2b] border border-[#2A2E39] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl z-10 text-[#dfe2f2]">
        {/* Top Header */}
        <div className="sticky top-0 bg-[#1b1f2b]/95 backdrop-blur-md px-6 py-4 border-b border-[#2A2E39] flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2962ff]/15 border border-[#2962ff]/30 text-[#2962ff] flex items-center justify-center font-bold text-sm">
              {symbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-headline text-white">{name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#262a35] text-[#B2B5BE] font-mono">
                  {symbol}
                </span>
              </div>
              <p className="text-xs text-[#8d90a2]">
                {isStock ? (item as StockItem).exchange : 'Global Benchmark Index'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleWatchlist(symbol)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWatchlisted 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
                  : 'bg-[#262a35] border-[#434656]/50 text-[#8d90a2] hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8d90a2] hover:text-white rounded-lg hover:bg-[#262a35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Price Header & Timeframe Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono-numbers text-white">
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div 
                className={`flex items-center gap-1.5 text-base font-semibold font-mono-numbers mt-1 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
                <span className="text-xs text-[#8d90a2] font-normal ml-2">Today's Session</span>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center bg-[#171b26] p-1 rounded-xl border border-[#2A2E39] gap-1">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeframe === tf
                      ? 'bg-[#2962ff] text-white shadow-xs'
                      : 'text-[#8d90a2] hover:text-[#dfe2f2]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="bg-[#171b26] border border-[#2A2E39] rounded-xl p-4 sm:p-6 relative">
            <div className="flex items-center justify-between text-xs text-[#8d90a2] mb-3">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPositive ? 'bg-[#089981]' : 'bg-[#F23645]'}`} />
                Live Real-Time Market Feed
              </span>
              <span>Range: ${minVal.toFixed(2)} - ${maxVal.toFixed(2)}</span>
            </div>

            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="modal-chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#2A2E39" strokeDasharray="2,2" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#2A2E39" strokeDasharray="2,2" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#2A2E39" strokeDasharray="2,2" strokeWidth="0.5" />

                {/* Area */}
                <path d={svgArea} fill="url(#modal-chart-grad)" />

                {/* Main line */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke={isPositive ? '#089981' : '#F23645'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-[#8d90a2] font-mono mt-2 pt-2 border-t border-[#2A2E39]">
              <span>09:30 AM</span>
              <span>11:30 AM</span>
              <span>01:30 PM</span>
              <span>04:00 PM CLOSE</span>
            </div>
          </div>

          {/* Key Metrics / Financial Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-[#171b26] p-3.5 rounded-xl border border-[#2A2E39]">
              <p className="text-xs text-[#8d90a2]">52W Range</p>
              <p className="text-sm font-semibold font-mono-numbers text-[#dfe2f2] mt-0.5">
                {isStock ? `$${(item as StockItem).fiftyTwoWeekLow.toFixed(2)} - $${(item as StockItem).fiftyTwoWeekHigh.toFixed(2)}` : '$4,103 - $5,264'}
              </p>
            </div>

            <div className="bg-[#171b26] p-3.5 rounded-xl border border-[#2A2E39]">
              <p className="text-xs text-[#8d90a2]">Market Cap / Vol</p>
              <p className="text-sm font-semibold font-mono-numbers text-[#dfe2f2] mt-0.5">
                {isStock ? (item as StockItem).marketCap : (item as MarketIndex).volume}
              </p>
            </div>

            <div className="bg-[#171b26] p-3.5 rounded-xl border border-[#2A2E39]">
              <p className="text-xs text-[#8d90a2]">P/E Ratio / Beta</p>
              <p className="text-sm font-semibold font-mono-numbers text-[#dfe2f2] mt-0.5">
                {isStock ? `${(item as StockItem).peRatio || 'N/A'} (β ${(item as StockItem).beta || 1.0})` : '24.5 (β 1.0)'}
              </p>
            </div>

            <div className="bg-[#171b26] p-3.5 rounded-xl border border-[#2A2E39]">
              <p className="text-xs text-[#8d90a2]">Analyst Target</p>
              <p className="text-sm font-semibold font-mono-numbers text-[#089981] mt-0.5">
                {isStock ? `$${(item as StockItem).analystTarget?.toFixed(2) || 'N/A'}` : '$5,400.00'}
              </p>
            </div>
          </div>

          {/* Paper Trading Execution Desk */}
          <div className="bg-[#171b26] rounded-xl p-5 border border-[#2A2E39] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#2962ff]" />
                <span>Paper Trading Terminal</span>
              </h3>
              <span className="text-xs text-[#8d90a2]">
                Available Cash: <strong className="text-white font-mono">${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </span>
            </div>

            {tradeSuccessMsg && (
              <div className="p-3 bg-[#089981]/15 border border-[#089981]/30 rounded-lg text-xs font-semibold text-[#089981] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{tradeSuccessMsg}</span>
              </div>
            )}

            {currentPosition && currentPosition.shares > 0 && (
              <div className="p-3 bg-[#262a35] rounded-lg text-xs flex items-center justify-between">
                <span>Current Holding: <strong>{currentPosition.shares} shares</strong> @ ${currentPosition.avgBuyPrice.toFixed(2)}</span>
                <span className={(price - currentPosition.avgBuyPrice) >= 0 ? 'text-[#089981] font-bold' : 'text-[#F23645] font-bold'}>
                  P&L: {((price - currentPosition.avgBuyPrice) * currentPosition.shares >= 0 ? '+' : '')}$
                  {((price - currentPosition.avgBuyPrice) * currentPosition.shares).toFixed(2)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs text-[#8d90a2] block mb-1">Quantity (Shares / Units)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#1b1f2b] border border-[#2A2E39] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8d90a2] block mb-1">Estimated Total</label>
                <div className="w-full bg-[#1b1f2b] border border-[#2A2E39] rounded-lg px-3 py-2 text-sm font-mono text-white font-semibold">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  id="trade-buy-btn"
                  onClick={handleBuy}
                  className="flex-1 bg-[#089981] hover:bg-[#089981]/90 active:scale-95 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
                >
                  Buy {symbol}
                </button>
                <button
                  id="trade-sell-btn"
                  onClick={handleSell}
                  className="flex-1 bg-[#F23645] hover:bg-[#F23645]/90 active:scale-95 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
