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
  CheckCircle2,
  Bell,
  SlidersHorizontal,
  CandlestickChart,
  Activity,
  ArrowRight
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
  onSetAlert?: (symbol: string, price: number) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  userBalance,
  onExecuteTrade,
  currentPosition,
  onSetAlert
}) => {
  if (!item) return null;

  const isStock = 'price' in item;
  const symbol = isStock ? item.symbol : item.ticker;
  const name = item.name;
  const price = isStock ? item.price : item.value;
  const change = item.change;
  const isPositive = isStock ? item.isBullish : item.isBullish;

  const [activeTab, setActiveTab] = useState<'chart' | 'orderbook' | 'financials'>('chart');
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartMode, setChartMode] = useState<'line' | 'candles'>('candles');
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Trading states
  const [tradeOrderType, setTradeOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(Number(price.toFixed(2)));
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string | null>(null);

  // Generate synthetic rich candlestick data
  const generateCandles = () => {
    const count = timeframe === '1D' ? 16 : timeframe === '5D' ? 24 : 32;
    const candles = [];
    let currentOpen = price * 0.97;

    for (let i = 0; i < count; i++) {
      const delta = (Math.sin(i / 2.2) * (price * 0.012)) + ((Math.random() - 0.48) * (price * 0.009));
      const close = Math.max(currentOpen + delta, price * 0.82);
      const high = Math.max(currentOpen, close) + (Math.random() * (price * 0.005));
      const low = Math.min(currentOpen, close) - (Math.random() * (price * 0.005));
      const volume = Math.floor(Math.random() * 500000 + 100000);
      const isGreen = close >= currentOpen;

      candles.push({
        time: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`,
        open: currentOpen,
        high,
        low,
        close,
        volume,
        isGreen
      });

      currentOpen = close;
    }

    // Set the last candle to match actual price
    if (candles.length > 0) {
      const last = candles[candles.length - 1];
      last.close = price;
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
      last.isGreen = price >= last.open;
    }

    return candles;
  };

  const candles = generateCandles();
  const allPrices = candles.flatMap(c => [c.low, c.high]);
  const minVal = Math.min(...allPrices) * 0.996;
  const maxVal = Math.max(...allPrices) * 1.004;
  const range = maxVal - minVal || 1;

  // Level 2 synthetic order book depth
  const bids = [
    { price: price - 0.05, size: 2400, depth: 95 },
    { price: price - 0.10, size: 4800, depth: 85 },
    { price: price - 0.15, size: 1200, depth: 65 },
    { price: price - 0.20, size: 8500, depth: 40 },
    { price: price - 0.25, size: 3100, depth: 20 },
  ];

  const asks = [
    { price: price + 0.05, size: 1900, depth: 25 },
    { price: price + 0.10, size: 3400, depth: 55 },
    { price: price + 0.15, size: 6200, depth: 75 },
    { price: price + 0.20, size: 4100, depth: 88 },
    { price: price + 0.25, size: 9800, depth: 100 },
  ];

  const totalCost = tradeShares * (tradeOrderType === 'LIMIT' ? limitPrice : price);

  const handleBuy = () => {
    if (totalCost > userBalance) {
      alert("Insufficient paper trading buying power!");
      return;
    }
    const executedPrice = tradeOrderType === 'LIMIT' ? limitPrice : price;
    onExecuteTrade(symbol, name, 'BUY', tradeShares, executedPrice);
    setTradeSuccessMsg(`Order Executed: Bought ${tradeShares} shares of ${symbol} @ $${executedPrice.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  const handleSell = () => {
    if (!currentPosition || currentPosition.shares < tradeShares) {
      alert(`You only hold ${currentPosition?.shares || 0} shares of ${symbol}.`);
      return;
    }
    const executedPrice = tradeOrderType === 'LIMIT' ? limitPrice : price;
    onExecuteTrade(symbol, name, 'SELL', tradeShares, executedPrice);
    setTradeSuccessMsg(`Order Executed: Sold ${tradeShares} shares of ${symbol} @ $${executedPrice.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  const handleCreateAlert = () => {
    setAlertSuccessMsg(`Price Alert set for ${symbol} at $${price.toFixed(2)}!`);
    setTimeout(() => setAlertSuccessMsg(null), 3500);
  };

  const activeCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#1b1f2b] border border-[#2A2E39] rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto shadow-2xl z-10 text-[#dfe2f2]">
        {/* Top Sticky Header */}
        <div className="sticky top-0 bg-[#1b1f2b]/95 backdrop-blur-md px-4 sm:px-6 py-4 border-b border-[#2A2E39] flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2962ff]/15 border border-[#2962ff]/30 text-[#2962ff] flex items-center justify-center font-bold text-sm">
              {symbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-headline text-white">{name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#262a35] text-[#b6c4ff] font-mono font-bold">
                  {symbol}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#089981]/15 text-[#089981] font-mono hidden sm:inline">
                  NASDAQ • Real-Time
                </span>
              </div>
              <p className="text-xs text-[#8d90a2]">
                {isStock ? (item as StockItem).description : 'Global Benchmark Index'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateAlert}
              className="p-2 rounded-lg bg-[#262a35] border border-[#434656]/50 text-[#8d90a2] hover:text-[#2962ff] transition-colors cursor-pointer"
              title="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleWatchlist(symbol)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWatchlisted 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
                  : 'bg-[#262a35] border-[#434656]/50 text-[#8d90a2] hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8d90a2] hover:text-white rounded-lg hover:bg-[#262a35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Banners */}
        {tradeSuccessMsg && (
          <div className="mx-6 mt-4 p-3 bg-[#089981]/15 border border-[#089981]/30 rounded-lg text-xs font-semibold text-[#089981] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{tradeSuccessMsg}</span>
          </div>
        )}
        {alertSuccessMsg && (
          <div className="mx-6 mt-4 p-3 bg-[#2962ff]/15 border border-[#2962ff]/30 rounded-lg text-xs font-semibold text-[#b6c4ff] flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>{alertSuccessMsg}</span>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Level Price Bar & View Modes */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#2A2E39]">
            <div>
              <div className="flex items-baseline gap-3">
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white">
                  ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div 
                  className={`flex items-center gap-1 text-base font-semibold font-mono ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
                </div>
              </div>

              {/* Dynamic OHLC tooltip */}
              {activeCandle && (
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8d90a2] mt-1.5">
                  <span>O: <strong className="text-white">${activeCandle.open.toFixed(2)}</strong></span>
                  <span>H: <strong className="text-[#089981]">${activeCandle.high.toFixed(2)}</strong></span>
                  <span>L: <strong className="text-[#F23645]">${activeCandle.low.toFixed(2)}</strong></span>
                  <span>C: <strong className="text-white">${activeCandle.close.toFixed(2)}</strong></span>
                  <span>Vol: <strong className="text-white">{(activeCandle.volume / 1000).toFixed(0)}k</strong></span>
                </div>
              )}
            </div>

            {/* Navigation Tabs (Chart, Order Book, Financials) */}
            <div className="flex items-center bg-[#171b26] p-1 rounded-xl border border-[#2A2E39] gap-1 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'chart' ? 'bg-[#2962ff] text-white shadow-xs' : 'text-[#8d90a2] hover:text-white'
                }`}
              >
                Chart & Technicals
              </button>
              <button
                onClick={() => setActiveTab('orderbook')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'orderbook' ? 'bg-[#2962ff] text-white shadow-xs' : 'text-[#8d90a2] hover:text-white'
                }`}
              >
                Level 2 Book
              </button>
              <button
                onClick={() => setActiveTab('financials')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'financials' ? 'bg-[#2962ff] text-white shadow-xs' : 'text-[#8d90a2] hover:text-white'
                }`}
              >
                Financials
              </button>
            </div>
          </div>

          {/* TAB 1: CHART & TECHNICALS */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              {/* Chart Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Timeframes */}
                <div className="flex items-center bg-[#171b26] p-1 rounded-lg border border-[#2A2E39] gap-0.5">
                  {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 font-semibold rounded transition-colors ${
                        timeframe === tf ? 'bg-[#2962ff] text-white' : 'text-[#8d90a2] hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Overlays & Chart Type */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#171b26] p-1 rounded-lg border border-[#2A2E39] gap-1">
                    <button
                      onClick={() => setChartMode('candles')}
                      className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                        chartMode === 'candles' ? 'bg-[#313441] text-white font-semibold' : 'text-[#8d90a2]'
                      }`}
                    >
                      Candles
                    </button>
                    <button
                      onClick={() => setChartMode('line')}
                      className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                        chartMode === 'line' ? 'bg-[#313441] text-white font-semibold' : 'text-[#8d90a2]'
                      }`}
                    >
                      Line
                    </button>
                  </div>

                  {/* Indicator Toggles */}
                  <button
                    onClick={() => setShowSMA(!showSMA)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                      showSMA ? 'bg-[#2962ff]/15 border-[#2962ff]/40 text-[#b6c4ff]' : 'bg-[#171b26] border-[#2A2E39] text-[#8d90a2]'
                    }`}
                  >
                    SMA (20/50)
                  </button>
                  <button
                    onClick={() => setShowVolume(!showVolume)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                      showVolume ? 'bg-[#2962ff]/15 border-[#2962ff]/40 text-[#b6c4ff]' : 'bg-[#171b26] border-[#2A2E39] text-[#8d90a2]'
                    }`}
                  >
                    Volume
                  </button>
                  <button
                    onClick={() => setShowRSI(!showRSI)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                      showRSI ? 'bg-[#2962ff]/15 border-[#2962ff]/40 text-[#b6c4ff]' : 'bg-[#171b26] border-[#2A2E39] text-[#8d90a2]'
                    }`}
                  >
                    RSI (14)
                  </button>
                </div>
              </div>

              {/* High-Definition SVG Candlestick Canvas */}
              <div className="bg-[#171b26] border border-[#2A2E39] rounded-xl p-4 relative select-none">
                <div className="h-72 w-full relative">
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {/* Background Guidelines */}
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#2A2E39" strokeDasharray="1,1" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#2A2E39" strokeDasharray="1,1" strokeWidth="0.5" />
                    <line x1="0" y1="80" x2="100" y2="80" stroke="#2A2E39" strokeDasharray="1,1" strokeWidth="0.5" />

                    {/* Volume Bars at bottom */}
                    {showVolume && candles.map((c, i) => {
                      const barWidth = 100 / candles.length;
                      const x = i * barWidth + barWidth * 0.15;
                      const barHeight = (c.volume / 600000) * 18;
                      const y = 95 - barHeight;
                      return (
                        <rect
                          key={`vol-${i}`}
                          x={x}
                          y={y}
                          width={barWidth * 0.7}
                          height={barHeight}
                          fill={c.isGreen ? '#089981' : '#F23645'}
                          opacity="0.3"
                        />
                      );
                    })}

                    {/* Candlestick Wicks & Bodies */}
                    {chartMode === 'candles' && candles.map((c, i) => {
                      const barWidth = 100 / candles.length;
                      const centerX = i * barWidth + barWidth / 2;
                      const wickTop = 85 - ((c.high - minVal) / range) * 70;
                      const wickBottom = 85 - ((c.low - minVal) / range) * 70;
                      const bodyTop = 85 - ((Math.max(c.open, c.close) - minVal) / range) * 70;
                      const bodyBottom = 85 - ((Math.min(c.open, c.close) - minVal) / range) * 70;
                      const bodyHeight = Math.max(1.5, bodyBottom - bodyTop);

                      return (
                        <g 
                          key={`candle-${i}`} 
                          onMouseEnter={() => setHoverIndex(i)}
                          className="cursor-crosshair"
                        >
                          {/* Wick */}
                          <line
                            x1={centerX}
                            y1={wickTop}
                            x2={centerX}
                            y2={wickBottom}
                            stroke={c.isGreen ? '#089981' : '#F23645'}
                            strokeWidth="0.75"
                          />
                          {/* Body */}
                          <rect
                            x={centerX - barWidth * 0.35}
                            y={bodyTop}
                            width={barWidth * 0.7}
                            height={bodyHeight}
                            fill={c.isGreen ? '#089981' : '#F23645'}
                            rx="0.5"
                          />
                        </g>
                      );
                    })}

                    {/* Line Mode Curve */}
                    {chartMode === 'line' && (
                      <>
                        <defs>
                          <linearGradient id="pro-line-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={candles.map((c, i) => {
                            const x = (i / (candles.length - 1)) * 100;
                            const y = 85 - ((c.close - minVal) / range) * 70;
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ') + ' L 100 95 L 0 95 Z'}
                          fill="url(#pro-line-grad)"
                        />
                        <path
                          d={candles.map((c, i) => {
                            const x = (i / (candles.length - 1)) * 100;
                            const y = 85 - ((c.close - minVal) / range) * 70;
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#2962ff"
                          strokeWidth="2"
                        />
                      </>
                    )}

                    {/* SMA Overlay Line */}
                    {showSMA && (
                      <path
                        d={candles.map((c, i) => {
                          const x = (i / (candles.length - 1)) * 100;
                          const smaVal = c.close * 0.995;
                          const y = 85 - ((smaVal - minVal) / range) * 70;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        strokeDasharray="2,1"
                      />
                    )}
                  </svg>
                </div>

                {/* Bottom Time Axis */}
                <div className="flex justify-between text-[11px] text-[#8d90a2] font-mono mt-2 pt-2 border-t border-[#2A2E39]">
                  <span>09:30 AM OPEN</span>
                  <span>11:30 AM</span>
                  <span>01:30 PM</span>
                  <span>04:00 PM CLOSE</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEVEL 2 ORDER BOOK DEPTH */}
          {activeTab === 'orderbook' && (
            <div className="bg-[#171b26] border border-[#2A2E39] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8d90a2]">
                <span className="font-semibold text-white">Direct Exchange Order Book (NASDAQ L2)</span>
                <span>Spread: <strong className="font-mono text-[#089981]">$0.02 (0.01%)</strong></span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* BIDS LADDER */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#089981] pb-1 border-b border-[#2A2E39]">
                    <span>BID SIZE</span>
                    <span>BID PRICE</span>
                  </div>
                  {bids.map((b, i) => (
                    <div key={i} className="relative flex justify-between items-center text-xs font-mono py-1 px-2 rounded">
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 rounded"
                        style={{ width: `${b.depth}%` }}
                      />
                      <span className="relative z-10 text-[#dfe2f2]">{b.size.toLocaleString()}</span>
                      <span className="relative z-10 font-bold text-[#089981]">${b.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* ASKS LADDER */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#F23645] pb-1 border-b border-[#2A2E39]">
                    <span>ASK PRICE</span>
                    <span>ASK SIZE</span>
                  </div>
                  {asks.map((a, i) => (
                    <div key={i} className="relative flex justify-between items-center text-xs font-mono py-1 px-2 rounded">
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-[#F23645]/15 rounded"
                        style={{ width: `${a.depth}%` }}
                      />
                      <span className="relative z-10 font-bold text-[#F23645]">${a.price.toFixed(2)}</span>
                      <span className="relative z-10 text-[#dfe2f2]">{a.size.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIALS & EARNINGS SURPRISES */}
          {activeTab === 'financials' && (
            <div className="bg-[#171b26] border border-[#2A2E39] rounded-xl p-5 space-y-6">
              <h3 className="font-headline font-bold text-white text-base">Quarterly Earnings Performance</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { q: 'Q1 FY24', estimate: '$4.50', actual: '$5.16', surprise: '+14.6%' },
                  { q: 'Q2 FY24', estimate: '$5.20', actual: '$5.82', surprise: '+11.9%' },
                  { q: 'Q3 FY24', estimate: '$5.80', actual: '$6.12', surprise: '+5.5%' },
                  { q: 'Q4 FY24 (Est)', estimate: '$6.40', actual: 'Pending', surprise: 'Est' },
                ].map((ern, i) => (
                  <div key={i} className="bg-[#1b1f2b] p-3.5 rounded-xl border border-[#2A2E39]">
                    <span className="text-xs font-bold text-[#b6c4ff]">{ern.q}</span>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between text-[#8d90a2]">
                        <span>Est EPS:</span>
                        <span className="font-mono text-white">{ern.estimate}</span>
                      </div>
                      <div className="flex justify-between text-[#8d90a2]">
                        <span>Actual:</span>
                        <span className="font-mono text-[#089981] font-bold">{ern.actual}</span>
                      </div>
                      <div className="flex justify-between text-[#8d90a2]">
                        <span>Surprise:</span>
                        <span className="font-mono text-[#089981]">{ern.surprise}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Paper Trading Terminal */}
          <div className="bg-[#171b26] rounded-xl p-5 border border-[#2A2E39] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#2962ff]" />
                <h3 className="font-headline font-bold text-base text-white">Execution Trading Desk</h3>
              </div>
              <span className="text-xs text-[#8d90a2]">
                Buying Power: <strong className="text-white font-mono">${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </span>
            </div>

            {/* Position summary if held */}
            {currentPosition && currentPosition.shares > 0 && (
              <div className="p-3 bg-[#262a35] rounded-lg text-xs flex items-center justify-between font-mono">
                <span>Holdings: <strong className="text-white">{currentPosition.shares} shares</strong> @ ${currentPosition.avgBuyPrice.toFixed(2)}</span>
                <span className={(price - currentPosition.avgBuyPrice) >= 0 ? 'text-[#089981] font-bold' : 'text-[#F23645] font-bold'}>
                  P&L: {((price - currentPosition.avgBuyPrice) * currentPosition.shares >= 0 ? '+' : '')}$
                  {((price - currentPosition.avgBuyPrice) * currentPosition.shares).toFixed(2)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              {/* Order Type */}
              <div>
                <label className="text-xs text-[#8d90a2] block mb-1">Order Type</label>
                <select
                  value={tradeOrderType}
                  onChange={(e) => setTradeOrderType(e.target.value as any)}
                  className="w-full bg-[#1b1f2b] border border-[#2A2E39] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#2962ff]"
                >
                  <option value="MARKET">Market Execution</option>
                  <option value="LIMIT">Limit Order</option>
                </select>
              </div>

              {/* Shares */}
              <div>
                <label className="text-xs text-[#8d90a2] block mb-1">Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#1b1f2b] border border-[#2A2E39] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              {/* Limit Price or Total */}
              <div>
                <label className="text-xs text-[#8d90a2] block mb-1">Total Est. Cost</label>
                <div className="w-full bg-[#1b1f2b] border border-[#2A2E39] rounded-lg px-3 py-2 text-xs font-mono text-white font-bold">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  id="pro-buy-btn"
                  onClick={handleBuy}
                  className="flex-1 bg-[#089981] hover:bg-[#089981]/90 active:scale-95 text-white font-bold py-2 rounded-lg text-xs transition-all shadow-sm cursor-pointer"
                >
                  Buy {symbol}
                </button>
                <button
                  id="pro-sell-btn"
                  onClick={handleSell}
                  className="flex-1 bg-[#F23645] hover:bg-[#F23645]/90 active:scale-95 text-white font-bold py-2 rounded-lg text-xs transition-all shadow-sm cursor-pointer"
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
