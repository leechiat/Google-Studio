import React, { useState } from 'react';
import { X, TrendingUp, MessageSquare, ThumbsUp, Flame, Send, Award, Share2 } from 'lucide-react';
import { CommunityTrend } from '../types';

interface CommunityModalProps {
  trend: CommunityTrend | null;
  onClose: () => void;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({
  trend,
  onClose
}) => {
  if (!trend) return null;

  const [posts, setPosts] = useState(trend.recentPosts);
  const [newComment, setNewComment] = useState('');
  const [bullishVotes, setBullishVotes] = useState(trend.sentimentBullishPct);
  const [userVoted, setUserVoted] = useState<'bullish' | 'bearish' | null>(null);

  const handleVote = (type: 'bullish' | 'bearish') => {
    if (userVoted === type) return;
    setUserVoted(type);
    if (type === 'bullish') {
      setBullishVotes((prev) => Math.min(100, prev + 1));
    } else {
      setBullishVotes((prev) => Math.max(0, prev - 1));
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newPost = {
      author: 'You (Trader_Demo)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
      time: 'Just now',
      text: newComment.trim(),
      sentiment: (userVoted || 'bullish') as 'bullish' | 'bearish',
      likes: 1
    };

    setPosts([newPost, ...posts]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#1b1f2b] border border-[#2A2E39] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 text-[#dfe2f2]">
        {/* Header */}
        <div className="sticky top-0 bg-[#1b1f2b]/95 backdrop-blur-md px-6 py-4 border-b border-[#2A2E39] flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#313441] border border-[#434656]/50 flex items-center justify-center font-mono font-bold text-sm text-[#dfe2f2]">
              {trend.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-headline text-white">{trend.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#262a35] text-[#089981] font-mono font-semibold">
                  +{trend.change}% Today
                </span>
              </div>
              <p className="text-xs text-[#8d90a2] flex items-center gap-1.5 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Hot Catalyst: <span className="text-[#dfe2f2]">{trend.hotTopic}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8d90a2] hover:text-white rounded-lg hover:bg-[#262a35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sentiment Meter Bar */}
        <div className="p-6 bg-[#171b26] border-b border-[#2A2E39] space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#089981] flex items-center gap-1">
              Bullish ({bullishVotes}%)
            </span>
            <span className="text-[#8d90a2]">
              {trend.mentionsCount.toLocaleString()} Community Votes
            </span>
            <span className="text-[#F23645] flex items-center gap-1">
              Bearish ({100 - bullishVotes}%)
            </span>
          </div>

          {/* Dual Color Progress Bar */}
          <div className="h-3 w-full bg-[#F23645] rounded-full overflow-hidden flex">
            <div 
              className="bg-[#089981] h-full transition-all duration-300"
              style={{ width: `${bullishVotes}%` }}
            />
          </div>

          {/* Quick sentiment vote action */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => handleVote('bullish')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                userVoted === 'bullish'
                  ? 'bg-[#089981] text-white border-[#089981]'
                  : 'bg-[#262a35] text-[#089981] border-[#089981]/30 hover:bg-[#089981]/15'
              }`}
            >
              👍 Vote Bullish
            </button>
            <button
              onClick={() => handleVote('bearish')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                userVoted === 'bearish'
                  ? 'bg-[#F23645] text-white border-[#F23645]'
                  : 'bg-[#262a35] text-[#F23645] border-[#F23645]/30 hover:bg-[#F23645]/15'
              }`}
            >
              👎 Vote Bearish
            </button>
          </div>
        </div>

        {/* Discussions & Live Chat */}
        <div className="p-6 space-y-4">
          <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#2962ff]" />
            <span>Live Trader Insights</span>
          </h3>

          {/* Post Form */}
          <form onSubmit={handlePostComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your analysis or price target..."
              className="flex-1 bg-[#171b26] border border-[#2A2E39] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#8d90a2] focus:outline-none focus:border-[#2962ff]"
            />
            <button
              type="submit"
              className="bg-[#2962ff] hover:bg-[#2962ff]/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </form>

          {/* Posts List */}
          <div className="space-y-3 pt-2">
            {posts.map((post, idx) => (
              <div key={idx} className="bg-[#171b26] border border-[#2A2E39] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-7 h-7 rounded-full object-cover border border-[#434656]"
                    />
                    <span className="text-sm font-semibold text-white">{post.author}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      post.sentiment === 'bullish' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#F23645]/20 text-[#F23645]'
                    }`}>
                      {post.sentiment}
                    </span>
                  </div>
                  <span className="text-xs text-[#8d90a2]">{post.time}</span>
                </div>

                <p className="text-sm text-[#dfe2f2] leading-relaxed">{post.text}</p>

                <div className="flex items-center gap-4 text-xs text-[#8d90a2] pt-1">
                  <button className="flex items-center gap-1 hover:text-[#089981] transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
