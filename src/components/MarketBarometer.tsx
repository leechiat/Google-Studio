import React from 'react';
import { Activity, Gauge, TrendingUp, TrendingDown, Volume2, VolumeX, ShieldAlert, Zap } from 'lucide-react';

interface MarketBarometerProps {
  tickRate: number;
  onSetTickRate: (rate: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenFearGreedDetail?: () => void;
}

export const MarketBarometer: React.FC<MarketBarometerProps> = ({
  tickRate,
  onSetTickRate,
  soundEnabled,
  onToggleSound
}) => {
  const fearGreedScore = 72; // Greed
  const advancers = 1842;
  const decliners = 918;
  const advanceRatio = Math.round((advancers / (advancers + decliners)) * 100);

  return (
    <div className="bg-[#171b26] border border-[#2A2E39] rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs">
      {/* Left: Fear & Greed + Breadth */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Fear & Greed */}
        <div className="flex items-center gap-2.5 bg-[#1b1f2b] px-3 py-2 rounded-lg border border-[#2A2E39]">
          <Gauge className="w-4 h-4 text-[#089981]" />
          <div>
            <span className="text-[#8d90a2] block text-[10px] uppercase font-semibold">Market Mood</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="text-[#089981]">{fearGreedScore}/100</span>
              <span className="text-white font-normal">• Greed</span>
            </div>
          </div>
        </div>

        {/* Market Breadth (Advancers vs Decliners) */}
        <div className="flex items-center gap-3 bg-[#1b1f2b] px-3 py-2 rounded-lg border border-[#2A2E39]">
          <Activity className="w-4 h-4 text-[#2962ff]" />
          <div>
            <div className="flex justify-between items-center gap-3 text-[10px] text-[#8d90a2]">
              <span>BREADTH</span>
              <span className="font-mono text-[#089981] font-semibold">{advanceRatio}% Bullish</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1.5 w-24 bg-[#F23645] rounded-full overflow-hidden flex">
                <div className="bg-[#089981] h-full" style={{ width: `${advanceRatio}%` }} />
              </div>
              <span className="font-mono text-white text-[11px]">
                <span className="text-[#089981]">{advancers}</span> / <span className="text-[#F23645]">{decliners}</span>
              </span>
            </div>
          </div>
        </div>

        {/* VIX & 10Y Yield Quick Glance */}
        <div className="hidden md:flex items-center gap-4 text-[#dfe2f2]">
          <div>
            <span className="text-[10px] text-[#8d90a2] block">VIX INDEX</span>
            <span className="font-mono font-bold text-[#089981]">12.84 (-3.20%)</span>
          </div>
          <div className="h-6 w-px bg-[#2A2E39]" />
          <div>
            <span className="text-[10px] text-[#8d90a2] block">US 10Y BENCHMARK</span>
            <span className="font-mono font-bold text-[#dfe2f2]">4.285% (-0.92%)</span>
          </div>
        </div>
      </div>

      {/* Right: Pro Terminal Controls (Tick Rate & Audio) */}
      <div className="flex items-center justify-end gap-2 border-t lg:border-t-0 pt-2 lg:pt-0 border-[#2A2E39]">
        <span className="text-[10px] text-[#8d90a2] uppercase font-semibold hidden sm:inline">Feed Stream:</span>
        <div className="flex items-center bg-[#1b1f2b] p-0.5 rounded-lg border border-[#2A2E39]">
          <button
            onClick={() => onSetTickRate(1000)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
              tickRate === 1000 ? 'bg-[#2962ff] text-white font-bold' : 'text-[#8d90a2] hover:text-white'
            }`}
          >
            1s
          </button>
          <button
            onClick={() => onSetTickRate(4000)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
              tickRate === 4000 ? 'bg-[#2962ff] text-white font-bold' : 'text-[#8d90a2] hover:text-white'
            }`}
          >
            4s
          </button>
          <button
            onClick={() => onSetTickRate(0)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
              tickRate === 0 ? 'bg-[#93000a] text-white font-bold' : 'text-[#8d90a2] hover:text-white'
            }`}
          >
            Pause
          </button>
        </div>

        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            soundEnabled 
              ? 'bg-[#2962ff]/15 border-[#2962ff]/30 text-[#2962ff]' 
              : 'bg-[#1b1f2b] border-[#2A2E39] text-[#8d90a2] hover:text-white'
          }`}
          title={soundEnabled ? 'Audio alerts ON' : 'Audio alerts MUTED'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
