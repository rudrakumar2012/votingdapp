"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Candidate {
  name: string;
  voteCount: number;
}

export default function VotingTable({ candidates }: { candidates: Candidate[] }) {
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const maxVotes = Math.max(...candidates.map((c) => c.voteCount), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-soft-purple" />
            Live Results
          </CardTitle>
          <Badge variant="secondary">{totalVotes} total</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {candidates.map((c, i) => {
          const pct = totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;
          const barWidth = maxVotes > 0 ? (c.voteCount / maxVotes) * 100 : 0;

          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{c.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-soft-purple">{c.voteCount}</span>
                  <span className="text-xs text-muted-blue">{pct.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full bg-muted-blue/20 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-soft-purple to-light-pink transition-all duration-700 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
