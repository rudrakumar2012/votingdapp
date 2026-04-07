"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TxStatusModal from "@/components/voting/TxStatusModal";
import { useVoting } from "@/hooks/useVoting";
import { AlertCircle, Clock, Database, Users, FileText, Flag, CheckCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface Overview {
  totalVotes: number;
  lastSyncBlock: number;
  lastSyncAt: string | null;
}

export default function AdminDashboard() {
  const {
    votingActive,
    isEnded,
    remainingSeconds,
    endVoting,
    endVotingTxHash,
    endVotingPending,
    endVotingConfirming,
    endVotingConfirmed,
    endVotingError,
    refetch,
  } = useVoting();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endVotingActive, setEndVotingActive] = useState(false);
  const firstLoad = useRef(true);

  // Fetch overview
  const fetchOverview = () => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((data) => setOverview(data))
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Refetch overview when end voting confirmed
  useEffect(() => {
    if (endVotingConfirmed && !firstLoad.current) {
      setLoading(true);
      fetchOverview();
      refetch?.();
    }
    firstLoad.current = false;
  }, [endVotingConfirmed]);

  // Track when end voting starts
  useEffect(() => {
    if (endVotingPending) setEndVotingActive(true);
  }, [endVotingPending]);

  // Track when end voting done
  useEffect(() => {
    if (endVotingConfirmed) {
      setEndVotingActive(false);
    }
  }, [endVotingConfirmed]);

  const formatRemaining = (secs: number) => {
    if (secs <= 0) return "Expired";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m}m ${s}s`;
  };

  let endTxState: "pending" | "confirming" | "confirmed" | "rejected" | null = null;
  if (endVotingPending) endTxState = "pending";
  else if (endVotingConfirming) endTxState = "confirming";
  else if (endVotingConfirmed) endTxState = "confirmed";
  else if (endVotingError) endTxState = "rejected";

  function handleEndVoting() {
    endVoting();
    setShowEndConfirm(false);
  }

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
        <CardContent className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLoading(true);
              fetchOverview();
            }}
            className="text-muted-blue hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="border-muted-blue/30 bg-muted-blue/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* End Voting */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-deep-navy/50 border border-muted-blue/20">
            <div className="space-y-1">
              <p className="text-white font-medium">End Voting</p>
              <p className="text-xs text-muted-blue">
                Permanently close the current voting session. All votes remain valid.
              </p>
            </div>
            {votingActive && !isEnded ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowEndConfirm(true)}
                disabled={endVotingActive}
              >
                <Flag className="w-4 h-4 mr-1" />
                End Voting
              </Button>
            ) : (
              <span className="text-xs text-muted-blue italic">
                {isEnded ? "Already ended" : "Waiting for session"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* End Voting Confirmation */}
      {showEndConfirm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="py-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold">Confirm End Voting</h4>
                  <p className="text-sm text-muted-blue mt-1">
                    Are you sure you want to end the voting session? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowEndConfirm(false)} size="sm">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleEndVoting} size="sm">
                  Yes, End Voting
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* End Voting Tx Status */}
      {endTxState && (
        <TxStatusModal
          status={endTxState}
          txHash={endVotingTxHash ?? null}
          candidateName={null}
          onClose={() => {
            if (endVotingConfirmed) {
              setEndVotingActive(false);
            }
          }}
          errorMsg={endVotingError?.message ?? null}
        />
      )}
    </div>
  );
}
