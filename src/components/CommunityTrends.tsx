import React from 'react';
import { TrendingUp, ChevronRight, MessageSquare, Flame } from 'lucide-react';
import { CommunityTrend } from '../types';

interface CommunityTrendsProps {
  trends: CommunityTrend[];
  onSelectTrend: (trend: CommunityTrend) => void;
}

export const CommunityTrends: React.FC<CommunityTrendsProps> = ({
  trends,
  onSelectTrend
}) => {
  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline text-lg sm:text-xl font-bold text-[#dfe2f2] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#66dabf]" />
          <span>Community trends</span>
        </h3>
        <span className="text-xs text-[#8d90a2] flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Live Buzz
        </span>
      </div>

      {/* List Container */}
      <div className="bg-[#1b1f2b] rounded-xl border border-[#2A2E39] p-2 space-y-1 shadow-sm">
        {trends.map((trend) => (
          <button
            key={trend.symbol}
            id={`community-trend-${trend.symbol}`}
            onClick={() => onSelectTrend(trend)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#262a35] transition-all group text-left cursor-pointer border border-transparent hover:border-[#2A2E39]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#313441] border border-[#434656]/50 flex items-center justify-center font-mono-numbers text-xs font-semibold text-[#dfe2f2] group-hover:bg-[#2962ff]/20 group-hover:text-[#b6c4ff] group-hover:border-[#2962ff]/30 transition-all shrink-0">
                {trend.symbol}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#dfe2f2] group-hover:text-white truncate">
                  {trend.name}
                </div>
                <div className="text-xs text-[#8d90a2] flex items-center gap-2 truncate">
                  <span>{trend.exchange}</span>
                  <span>•</span>
                  <span className={trend.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
                    {trend.change >= 0 ? '+' : ''}{trend.change}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-[#089981]">
                  {trend.sentimentBullishPct}% Bullish
                </span>
                <span className="text-[10px] text-[#8d90a2] flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5" />
                  {trend.mentionsCount}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8d90a2] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
