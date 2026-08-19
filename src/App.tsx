/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { HeroSection } from './components/HeroSection';
import { NavPillTabs } from './components/NavPillTabs';
import { MarketBarometer } from './components/MarketBarometer';
import { MarketHeatmap } from './components/MarketHeatmap';
import { IndicesCards } from './components/IndicesCards';
import { StocksTable } from './components/StocksTable';
import { CommunityTrends } from './components/CommunityTrends';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { CommunityModal } from './components/CommunityModal';

import { 
  SidebarTab, 
  AssetCategory, 
  MarketIndex, 
  StockItem, 
  CommunityTrend,
  UserPosition,
  TradeOrder
} from './types';

import { 
  INITIAL_INDICES, 
  MOCK_STOCKS, 
  COMMUNITY_TRENDS 
} from './data/mockMarketData';

export default function App() {
  // Navigation & Category States
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('indices');
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('us-stocks');
  const [selectedRegion, setSelectedRegion] = useState<string>('everywhere');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');

  // Live Market Data States
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockItem[]>(MOCK_STOCKS);
  const [communityTrends, setCommunityTrends] = useState<CommunityTrend[]>(COMMUNITY_TRENDS);

  // Pro Terminal States
  const [tickRate, setTickRate] = useState<number>(4000); // 4s default
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals & Interactive Overlays
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<StockItem | MarketIndex | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<CommunityTrend | null>(null);

  // User Account & Paper Trading Portfolio
  const [userBalance, setUserBalance] = useState<number>(100000);
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'BTC', 'SPX']);
  const [positions, setPositions] = useState<UserPosition[]>([
    { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 25, avgBuyPrice: 795.00, currentPrice: 850.20, type: 'BUY' },
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 40, avgBuyPrice: 172.50, currentPrice: 175.10, type: 'BUY' }
  ]);
  const [tradeHistory, setTradeHistory] = useState<TradeOrder[]>([
    { id: '1', symbol: 'NVDA', type: 'BUY', shares: 25, price: 795.00, timestamp: 'Today 10:14 AM', total: 19875.00 },
    { id: '2', symbol: 'AAPL', type: 'BUY', shares: 40, price: 172.50, timestamp: 'Yesterday 02:45 PM', total: 6900.00 }
  ]);

  // Audio synthesis helper for trading desk sounds
  const playTradeChime = (type: 'BUY' | 'SELL') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'BUY') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      } else {
        osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.15); // C5
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      // AudioContext policy fallback
    }
  };

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K to open search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Periodic subtle price fluctuation simulation for live market feel
  useEffect(() => {
    if (tickRate === 0) return; // Paused

    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // 40% chance each cycle to slightly fluctuate price
          if (Math.random() > 0.45) return stock;
          const delta = (Math.random() - 0.49) * (stock.price * 0.002);
          const newPrice = Math.max(0.1, Number((stock.price + delta).toFixed(2)));
          return {
            ...stock,
            price: newPrice,
            isBullish: stock.change >= 0
          };
        })
      );

      // Also update open positions currentPrice
      setPositions((prevPositions) =>
        prevPositions.map((pos) => {
          const matchStock = stocks.find((s) => s.symbol === pos.symbol);
          if (matchStock) {
            return { ...pos, currentPrice: matchStock.price };
          }
          return pos;
        })
      );
    }, tickRate);

    return () => clearInterval(interval);
  }, [stocks, tickRate]);

  // Handle Paper Trade Execution
  const handleExecuteTrade = (
    symbol: string,
    name: string,
    type: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    const totalAmount = shares * price;
    playTradeChime(type);

    if (type === 'BUY') {
      setUserBalance((prev) => prev - totalAmount);
      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === symbol);
        if (existing) {
          const totalShares = existing.shares + shares;
          const newAvgPrice = (existing.shares * existing.avgBuyPrice + totalAmount) / totalShares;
          return prev.map((p) =>
            p.symbol === symbol
              ? { ...p, shares: totalShares, avgBuyPrice: newAvgPrice, currentPrice: price }
              : p
          );
        } else {
          return [...prev, { symbol, name, shares, avgBuyPrice: price, currentPrice: price, type: 'BUY' }];
        }
      });
    } else {
      // SELL
      setUserBalance((prev) => prev + totalAmount);
      setPositions((prev) => {
        return prev
          .map((p) => {
            if (p.symbol === symbol) {
              return { ...p, shares: p.shares - shares, currentPrice: price };
            }
            return p;
          })
          .filter((p) => p.shares > 0);
      });
    }

    // Add to history
    const newOrder: TradeOrder = {
      id: Math.random().toString(36).substring(2, 9),
      symbol,
      type,
      shares,
      price,
      timestamp: 'Just now',
      total: totalAmount
    };
    setTradeHistory((prev) => [newOrder, ...prev]);
  };

  // Watchlist toggle handler
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Reset Account balance
  const handleResetAccount = () => {
    setUserBalance(100000);
    setPositions([]);
    setTradeHistory([]);
  };

  // Filter stocks according to active category or sidebar tab
  const getFilteredStocks = () => {
    if (activeCategory === 'crypto') {
      return stocks.filter((s) => s.category === 'crypto');
    }
    if (activeCategory === 'forex') {
      return stocks.filter((s) => s.category === 'forex');
    }
    if (activeCategory === 'futures') {
      return stocks.filter((s) => s.category === 'futures');
    }
    if (activeCategory === 'government-bonds' || activeCategory === 'corporate-bonds') {
      return stocks.filter((s) => s.category === 'government-bonds');
    }
    // Default US stocks
    return stocks.filter((s) => s.category === 'us-stocks');
  };

  const currentCategoryStocks = getFilteredStocks();

  // Sidebar selection synchronizer
  const handleSidebarTabSelect = (tab: SidebarTab) => {
    setActiveSidebarTab(tab);
    if (tab === 'crypto') setActiveCategory('crypto');
    else if (tab === 'forex') setActiveCategory('forex');
    else if (tab === 'futures') setActiveCategory('futures');
    else if (tab === 'bonds') setActiveCategory('government-bonds');
    else if (tab === 'stocks') setActiveCategory('us-stocks');
    else if (tab === 'indices') setActiveCategory('us-stocks');
  };

  return (
    <div className="bg-[#0f131e] font-sans text-[#dfe2f2] min-h-screen flex selection:bg-[#2962ff] selection:text-white">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        activeTab={activeSidebarTab}
        onSelectTab={handleSidebarTabSelect}
        onOpenAccount={() => setAccountModalOpen(true)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Body Content Area (offset left by 64 = 16rem on large screens) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <Header
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenAccount={() => setAccountModalOpen(true)}
          onOpenCommunity={() => setCommunityModalOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onGetStarted={() => setAccountModalOpen(true)}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* Main Dashboard Canvas */}
        <main className="pt-16 pb-20 bg-[#0f131e] min-h-screen flex flex-col">
          {/* Real-time Ticker Tape Bar */}
          <TickerTape
            indices={indices}
            stocks={stocks}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />

          {/* Hero Section */}
          <HeroSection
            onOpenSearch={() => setSearchModalOpen(true)}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />

          {/* Sticky Navigation Pills */}
          <NavPillTabs
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              if (cat === 'crypto') setActiveSidebarTab('crypto');
              else if (cat === 'forex') setActiveSidebarTab('forex');
              else if (cat === 'futures') setActiveSidebarTab('futures');
              else if (cat === 'government-bonds') setActiveSidebarTab('bonds');
              else setActiveSidebarTab('stocks');
            }}
          />

          {/* Main Dashboard Content Layout */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12 max-w-7xl mx-auto w-full">
            {/* Pro Market Barometer & Breadth Bar */}
            <MarketBarometer
              tickRate={tickRate}
              onSetTickRate={setTickRate}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />

            {/* Section 1: Indices Benchmark Cards */}
            <IndicesCards
              indices={indices}
              onSelectIndex={(idx) => setSelectedAsset(idx)}
              onSelectSecondary={(name) => {
                const found = indices.find((i) => i.name.toLowerCase().includes(name.toLowerCase()));
                if (found) setSelectedAsset(found);
                else setSelectedAsset(indices[0]);
              }}
            />

            {/* Section 2: US Stocks or Heatmap Mode */}
            {viewMode === 'heatmap' ? (
              <MarketHeatmap
                stocks={stocks}
                onSelectStock={(stk) => setSelectedAsset(stk)}
              />
            ) : (
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#2A2E39] pb-4">
                  <h2 
                    id="category-stocks-heading"
                    onClick={() => setSearchModalOpen(true)}
                    className="font-headline text-2xl sm:text-3xl font-bold text-[#dfe2f2] flex items-center gap-2 group cursor-pointer hover:text-white transition-colors"
                  >
                    <span className="capitalize">
                      {activeCategory.replace('-', ' ')}
                    </span>
                    <span className="text-[#c3c5d8] group-hover:translate-x-1 transition-transform">
                      ›
                    </span>
                  </h2>
                </div>

                {/* Split 2/3 and 1/3 Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Highest Volume / Active Stocks Panel */}
                  <div className="col-span-1 lg:col-span-2">
                    <StocksTable
                      stocks={currentCategoryStocks}
                      onSelectStock={(stk) => setSelectedAsset(stk)}
                      onSeeAll={() => setSearchModalOpen(true)}
                      categoryLabel={activeCategory}
                      watchlist={watchlist}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  </div>

                  {/* Community Trends Sidebar */}
                  <div className="col-span-1">
                    <CommunityTrends
                      trends={communityTrends}
                      onSelectTrend={(trend) => {
                        setSelectedTrend(trend);
                        setCommunityModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* 3. Interactive Modals & Drawers */}

      {/* Asset Detail & Trading Modal */}
      <AssetDetailModal
        item={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isWatchlisted={selectedAsset ? watchlist.includes('price' in selectedAsset ? selectedAsset.symbol : selectedAsset.ticker) : false}
        onToggleWatchlist={handleToggleWatchlist}
        userBalance={userBalance}
        onExecuteTrade={handleExecuteTrade}
        currentPosition={
          selectedAsset && 'price' in selectedAsset
            ? positions.find((p) => p.symbol === selectedAsset.symbol)
            : undefined
        }
      />

      {/* Command Palette Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        stocks={stocks}
        indices={indices}
        onSelectStock={(stk) => setSelectedAsset(stk)}
        onSelectIndex={(idx) => setSelectedAsset(idx)}
      />

      {/* User Account & Portfolio Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        userBalance={userBalance}
        positions={positions}
        tradeHistory={tradeHistory}
        watchlist={watchlist}
        allStocks={stocks}
        onSelectStock={(stk) => setSelectedAsset(stk)}
        onResetAccount={handleResetAccount}
      />

      {/* Community Sentiment & Discussion Modal */}
      <CommunityModal
        trend={selectedTrend || communityTrends[0]}
        onClose={() => {
          setCommunityModalOpen(false);
          setSelectedTrend(null);
        }}
      />
    </div>
  );
}
