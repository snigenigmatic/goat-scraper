"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trophy, Medal, Award, TrendingUp, Users, Wifi, WifiOff, Edit } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LeaderboardEntry {
  userId: string;
  username: string;
  completed: number;
  total: number;
  percentage: number;
  lastUpdate: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
  currentUserRank: number | null;
  isConnected: boolean;
  username: string;
  onUpdateUsername?: (newUsername: string) => void;
}

export function Leaderboard({ entries, currentUserId, currentUserRank, isConnected, username, onUpdateUsername }: LeaderboardProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  const handleUpdateUsername = () => {
    if (newUsername.trim() && onUpdateUsername) {
      onUpdateUsername(newUsername.trim());
      setIsEditingUsername(false);
    }
  };
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 w-5 text-center">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">1st</Badge>;
      case 2:
        return <Badge variant="secondary">2nd</Badge>;
      case 3:
        return <Badge variant="outline" className="border-amber-700 text-amber-700">3rd</Badge>;
      default:
        return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  const currentUserEntry = entries.find(e => e.userId === currentUserId);

  return (
    <Card className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Live Leaderboard</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <Wifi className="h-3.5 w-3.5" />
                <span>Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <WifiOff className="h-3.5 w-3.5" />
                <span>Offline</span>
              </div>
            )}
          </div>
        </div>
        
        {currentUserEntry && (
          <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  You: {username}
                </span>
                {onUpdateUsername && (
                  <Dialog open={isEditingUsername} onOpenChange={setIsEditingUsername}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Username</DialogTitle>
                        <DialogDescription>
                          Choose a new username for the leaderboard
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Input
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="Enter new username"
                          maxLength={20}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateUsername();
                            }
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditingUsername(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateUsername}>
                          Update
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              {currentUserRank && getRankBadge(currentUserRank)}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300">
                <span>{currentUserEntry.completed} / {currentUserEntry.total} completed</span>
                <span className="font-semibold">{currentUserEntry.percentage}%</span>
              </div>
              <Progress value={currentUserEntry.percentage} className="h-2" />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No one is studying yet.</p>
            <p className="text-xs mt-1">Be the first to make progress!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {entries.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.userId === currentUserId;
                
                return (
                  <div
                    key={entry.userId}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrentUser
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 shadow-sm"
                        : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 mt-0.5">
                        {getRankIcon(rank)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium truncate ${
                              isCurrentUser 
                                ? "text-blue-900 dark:text-blue-100" 
                                : "text-slate-900 dark:text-slate-100"
                            }`}>
                              {entry.username}
                              {isCurrentUser && (
                                <span className="ml-1.5 text-xs text-blue-600 dark:text-blue-400">(You)</span>
                              )}
                            </span>
                          </div>
                          <span className={`text-xs font-semibold ${
                            isCurrentUser
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-slate-600 dark:text-slate-400"
                          }`}>
                            {entry.percentage}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={entry.percentage} 
                          className={`h-1.5 mb-1 ${
                            isCurrentUser ? "bg-blue-200 dark:bg-blue-900" : ""
                          }`}
                        />
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{entry.completed} / {entry.total} files</span>
                          {rank <= 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs py-0 h-5"
                            >
                              Top {rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        
        {entries.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 text-center">
            {entries.length} {entries.length === 1 ? "person" : "people"} studying this course
          </div>
        )}
      </CardContent>
    </Card>
  );
}
