"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TxStatusModal from "@/components/voting/TxStatusModal";
import { useVoting } from "@/hooks/useVoting";
import { AlertCircle, Clock, Database, Users, FileText, Flag, RefreshCw, UserPlus } from "lucide-react";
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
    addCandidate,
    addCandidateTxHash,
    addCandidatePending,
    addCandidateConfirming,
    addCandidateConfirmed,
    addCandidateError,
    refetch,
  } = useVoting();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endVotingActive, setEndVotingActive] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; newBlock: number } | null>(null);
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

  // Refetch after add candidate confirmed
  useEffect(() => {
    if (addCandidateConfirmed) {
      setLoading(true);
      fetchOverview();
      refetch?.();
      setNewCandidateName("");
    }
  }, [addCandidateConfirmed]);

  let addTxState: "pending" | "confirming" | "confirmed" | "rejected" | null = null;
  if (addCandidatePending) addTxState = "pending";
  else if (addCandidateConfirming) addTxState = "confirming";
  else if (addCandidateConfirmed) addTxState = "confirmed";
  else if (addCandidateError) addTxState = "rejected";

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

  function handleAddCandidate() {
    if (!newCandidateName.trim()) return;
    addCandidate(newCandidateName.trim());
  }

  async function syncNow() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Failed to sync from chain");
      setSyncResult({ synced: data.synced, newBlock: data.newBlock });
      // Refresh overview after sync
      setLoading(true);
      fetchOverview();
    } catch (e: any) {
      console.error("Sync error:", e);
      setSyncResult({ synced: -1, newBlock: 0 });
    } finally {
      setSyncing(false);
    }
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
                Permanently close the current voting session.
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

          {/* Add Candidate */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-deep-navy/50 border border-muted-blue/20">
            <div className="space-y-1 flex-1 mr-4">
              <p className="text-white font-medium">Add Candidate</p>
              <p className="text-xs text-muted-blue">
                Add a new candidate to the election.
              </p>
              {votingActive && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    placeholder="Candidate name"
                    className="flex-1 bg-deep-navy border border-muted-blue/30 rounded-lg px-3 py-1.5 text-sm text-white placeholder-muted-blue focus:outline-none focus:border-soft-purple"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newCandidateName.trim()) {
                        handleAddCandidate();
                      }
                    }}
                    disabled={addCandidatePending || addCandidateConfirming}
                  />
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={handleAddCandidate}
                    disabled={!newCandidateName.trim() || addCandidatePending || addCandidateConfirming}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            {!votingActive && (
              <span className="text-xs text-muted-blue italic">Voting inactive</span>
            )}
          </div>

          {/* Sync Now */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-deep-navy/50 border border-muted-blue/20">
            <div className="space-y-1 flex-1 mr-4">
              <p className="text-white font-medium">Sync from Chain</p>
              <p className="text-xs text-muted-blue">
                Manually fetch VoteCast events from Sepolia and update the DB.
              </p>
              {syncResult && (
                <p className={`text-xs font-medium mt-2 ${syncResult.synced < 0 ? "text-red-400" : "text-green-400"}`}>
                  {syncResult.synced < 0
                    ? "Sync failed. Check server logs."
                    : `Synced ${syncResult.synced} records (block ${syncResult.newBlock.toLocaleString()})`}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={syncNow}
              disabled={syncing}
            >
              <Database className="w-4 h-4 mr-1" />
              {syncing ? "Syncing..." : "Sync Now"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Candidate Tx Status */}
      {addTxState && (
        <TxStatusModal
          status={addTxState}
          txHash={addCandidateTxHash ?? null}
          candidateName={newCandidateName || null}
          onClose={() => {
            if (addCandidateConfirmed) {}
          }}
          errorMsg={addCandidateError?.message ?? null}
        />
      )}

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
