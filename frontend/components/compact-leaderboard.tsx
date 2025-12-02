"use client";

import { Trophy, Medal, Award, Zap } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  username: string;
  completed: number;
  total: number;
  percentage: number;
  lastUpdate: string;
}

interface CompactLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
  username: string;
}

export function CompactLeaderboard({ entries, currentUserId, username }: CompactLeaderboardProps) {
  const getRacerStyle = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return {
        className: "border-2 shadow-md scale-110",
        gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
        text: "text-white"
      };
    }
    switch (rank) {
      case 1:
        return {
          className: "border-2 shadow-md",
          gradient: "bg-gradient-to-br from-yellow-400 to-yellow-600",
          text: "text-yellow-900"
        };
      case 2:
        return {
          className: "border-2 shadow-md",
          gradient: "bg-gradient-to-br from-slate-300 to-slate-500",
          text: "text-slate-900"
        };
      case 3:
        return {
          className: "border-2 shadow-md",
          gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
          text: "text-orange-900"
        };
      default:
        return {
          className: "border",
          gradient: "bg-gradient-to-br from-slate-400 to-slate-600",
          text: "text-white"
        };
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return b.completed - a.completed;
  });

  // Get top 5 for display (fewer for horizontal layout)
  const topEntries = sortedEntries.slice(0, 5);
  const currentUserEntry = entries.find(e => e.userId === currentUserId);
  const currentUserRank = currentUserEntry 
    ? sortedEntries.findIndex(e => e.userId === currentUserId) + 1 
    : null;

  if (topEntries.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-2 bg-gradient-to-r from-slate-700/40 to-slate-800/40 dark:from-slate-800/40 dark:to-slate-900/40 border-l border-slate-600/50 dark:border-slate-700/50">
      {/* Race Icon */}
      <div className="flex items-center gap-1 pr-1.5 border-r border-slate-600/50 dark:border-slate-700/50">
        <Zap className="h-3 w-3 text-yellow-400" />
        <span className="text-[10px] font-semibold text-slate-200">Race</span>
      </div>

      {/* Horizontal Timeline Track */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {topEntries.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.userId === currentUserId;
          const style = getRacerStyle(rank, isCurrentUser);
          
          return (
            <div
              key={entry.userId}
              className="flex items-center gap-2 group relative"
            >
              {/* Racer avatar */}
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 ${style.gradient} ${style.className}`}
                title={`${entry.username} - ${entry.percentage}%`}
              >
                <span className={`text-[10px] font-bold ${style.text}`}>
                  {rank}
                </span>
              </div>

              {/* Username and progress */}
              <div className={`flex flex-col px-1 rounded ${isCurrentUser ? 'bg-blue-500/20 ring-1 ring-blue-500/50' : ''}`}>
                <span className={`text-[10px] font-semibold whitespace-nowrap ${isCurrentUser ? 'text-blue-100' : 'text-slate-200'}`}>
                  {entry.username}
                </span>
                <div className="flex items-center gap-0.5">
                  <div className="h-0.5 w-10 bg-slate-600 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isCurrentUser 
                          ? 'bg-blue-400' 
                          : rank === 1 
                          ? 'bg-yellow-400' 
                          : rank === 2 
                          ? 'bg-slate-300' 
                          : rank === 3 
                          ? 'bg-amber-600' 
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${entry.percentage}%` }}
                    />
                  </div>
                  <span className={`text-[8px] font-semibold ${isCurrentUser ? 'text-blue-200' : 'text-slate-300'}`}>
                    {entry.percentage}%
                  </span>
                </div>
              </div>

              {/* Connecting line to next racer */}
              {index < topEntries.length - 1 && (
                <div className="h-px w-1.5 bg-slate-600/50 dark:bg-slate-700/50" />
              )}
            </div>
          );
        })}
      </div>

      {/* Current User Rank Badge */}
      {currentUserRank && (
        <div className="pl-1.5 border-l border-slate-600/50 dark:border-slate-700/50">
          <div className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/50 rounded-full">
            <span className="text-[9px] font-bold text-blue-300">
              #{currentUserRank}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
