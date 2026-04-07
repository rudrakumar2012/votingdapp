"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVoting } from "@/hooks/useVoting";
import { Clock, Database, Users, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface Overview {
  totalVotes: number;
  lastSyncBlock: number;
  lastSyncAt: string | null;
}

export default function AdminDashboard() {
  const { votingActive, isEnded, remainingSeconds, owner } = useVoting();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((data) => setOverview(data))
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  }, []);

  const formatRemaining = (secs: number) => {
    if (secs <= 0) return "Expired";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Status Panel */}
      <Card className="border-muted-blue/30 bg-muted-blue/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Session Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-blue">Voting Active</p>
            <p className={`font-semibold ${votingActive ? "text-green-400" : "text-red-400"}`}>
              {votingActive ? "Yes" : "No"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-blue">Ended</p>
            <p className={`font-semibold ${isEnded ? "text-red-400" : "text-green-400"}`}>
              {isEnded ? "Yes" : "No"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-blue">Time Remaining</p>
            <p className="text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatRemaining(remainingSeconds)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-blue">Total Votes (DB)</p>
            <p className="text-white flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {loading ? "..." : overview?.totalVotes ?? 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-blue">Last Sync Block</p>
            <p className="text-white flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              {loading ? "..." : overview?.lastSyncBlock.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-blue">Last Sync Time</p>
            <p className="text-white flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {loading ? "..." : (overview?.lastSyncAt ? new Date(overview.lastSyncAt).toLocaleString() : "Never")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="border-muted-blue/30 bg-muted-blue/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-blue text-sm italic">
            <motion.span
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              Select an action below (coming next in Part 2B–2D)
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
