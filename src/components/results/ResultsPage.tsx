"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Vote, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Candidate {
  name: string;
  voteCount: number;
}

export default function ResultsPage({ candidates }: { candidates: Candidate[] }) {
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const maxVotes = Math.max(...candidates.map((c) => c.voteCount), 0);
  const winner = candidates.find((c) => c.voteCount === maxVotes && c.voteCount > 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8" id="results-content">
      <Link href="/" className="inline-flex items-center text-sm text-muted-blue hover:text-light-pink transition">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Election Results</h2>
        <Badge variant="secondary">{totalVotes} total votes cast</Badge>
      </div>

      {/* Winner Card */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-soft-purple/50 bg-gradient-to-br from-soft-purple/20 to-muted-blue/10">
            <CardContent className="text-center py-8">
              <Trophy className="w-12 h-12 text-soft-purple mx-auto mb-4" />
              <p className="text-xs uppercase tracking-widest text-light-pink mb-2">Winner</p>
              <h3 className="text-4xl font-extrabold text-white mb-2">{winner.name}</h3>
              <p className="text-xl font-mono text-soft-purple">{winner.voteCount} votes</p>
              <p className="text-sm text-muted-blue mt-1">
                {totalVotes > 0
                  ? ((winner.voteCount / totalVotes) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="text-center py-6 space-y-2">
            <Users className="w-6 h-6 text-muted-blue mx-auto" />
            <p className="text-xs text-muted-blue uppercase tracking-wider">Candidates</p>
            <p className="text-3xl font-bold text-white">{candidates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6 space-y-2">
            <Vote className="w-6 h-6 text-muted-blue mx-auto" />
            <p className="text-xs text-muted-blue uppercase tracking-wider">Votes Cast</p>
            <p className="text-3xl font-bold text-white">{totalVotes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {candidates.map((c, i) => {
          const pct = totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;
          const isWinner = winner?.name === c.name;

          return (
            <motion.div key={i} variants={item}>
              <Card
                className={
                  isWinner
                    ? "border-soft-purple/50 bg-soft-purple/5"
                    : "border-muted-blue/20"
                }
              >
                <CardContent className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        isWinner
                          ? "text-sm font-bold text-soft-purple"
                          : "text-sm font-medium text-white"
                      }
                    >
                      {c.name}
                    </span>
                    <span className="text-sm font-mono text-muted-blue">
                      {c.voteCount} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted-blue/20 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${
                        isWinner
                          ? "bg-gradient-to-r from-soft-purple to-light-pink"
                          : "bg-muted-blue"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
