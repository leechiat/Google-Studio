export type AssetCategory = 
  | 'us-stocks' 
  | 'world-stocks' 
  | 'crypto' 
  | 'futures' 
  | 'forex' 
  | 'government-bonds' 
  | 'corporate-bonds' 
  | 'etfs' 
  | 'economy';

export type SidebarTab = 'indices' | 'stocks' | 'crypto' | 'futures' | 'forex' | 'bonds';

export interface MarketIndex {
  id: string;
  badgeNumber: string;
  badgeBgColor: string; // Tailwind color class or hex
  name: string;
  ticker: string;
  value: number;
  change: number; // percentage
  changePoints: number;
  isBullish: boolean;
  sparklinePath: string;
  fillPath: string;
  historicalData: { time: string; value: number }[];
  high52w: number;
  low52w: number;
  open: number;
  prevClose: number;
  volume: string;
}

export interface StockItem {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  isBullish: boolean;
  category: AssetCategory;
  description: string;
  historicalPrices: { time: string; price: number; volume?: number }[];
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  beta: number;
  analystRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
  analystTarget: number;
}

export interface CommunityTrend {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  sentimentBullishPct: number;
  mentionsCount: number;
  hotTopic: string;
  recentPosts: {
    author: string;
    avatar: string;
    time: string;
    text: string;
    sentiment: 'bullish' | 'bearish';
    likes: number;
  }[];
}

export interface UserPosition {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  type: 'BUY' | 'SHORT';
}

export interface TradeOrder {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  timestamp: string;
  total: number;
}
