"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TxStatusModal from "@/components/voting/TxStatusModal";
import { useVoting } from "@/hooks/useVoting";
import { AlertCircle, Clock, Database, Users, FileText, Flag, RefreshCw, UserPlus, Rocket, Plus, X, Copy, Check } from "lucide-react";
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
    refetchContract,
  } = useVoting();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endVotingActive, setEndVotingActive] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; newBlock: number } | null>(null);
  const firstLoad = useRef(true);

  // Deploy new voting state
  const [deployCandidates, setDeployCandidates] = useState<string[]>(["", "", ""]);
  const [deployDuration, setDeployDuration] = useState(5);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ address: string; txHash: string } | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  // Deploy new voting
  function updateDeployCandidate(index: number, value: string) {
    setDeployCandidates((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function addCandidateRow() {
    setDeployCandidates((prev) => [...prev, ""]);
  }

  function removeCandidateRow(index: number) {
    setDeployCandidates((prev) => prev.filter((_, i) => i !== index));
  }

  async function deployNewVoting() {
    const candidates = deployCandidates.map((c) => c.trim()).filter(Boolean);
    if (candidates.length === 0) return;
    if (deployDuration <= 0) return;

    setDeploying(true);
    setDeployResult(null);
    setDeployError(null);

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidates, durationMinutes: deployDuration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deploy failed");
      setDeployResult({ address: data.address, txHash: data.txHash });
      // Refresh contract address and client data
      refetchContract?.();
      refetch?.();
      // Full reload to pick up new contract address on all pages
      setTimeout(() => window.location.reload(), 2000);
    } catch (e: any) {
      console.error("Deploy error:", e);
      setDeployError(e.message);
    } finally {
      setDeploying(false);
    }
  }

  function copyAddress(address: string) {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Status Panel */}
      <Card className="border-muted-blue/30 bg-muted-blue/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Session Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-deep-navy/50 border border-muted-blue/20 gap-3">
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
                className="w-full sm:w-auto"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-deep-navy/50 border border-muted-blue/20 gap-3">
            <div className="space-y-1 w-full sm:flex-1 sm:mr-4">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-deep-navy/50 border border-muted-blue/20 gap-3">
            <div className="space-y-1 w-full sm:flex-1 sm:mr-4">
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
              className="w-full sm:w-auto"
            >
              <Database className="w-4 h-4 mr-1" />
              {syncing ? "Syncing..." : "Sync Now"}
            </Button>
          </div>

          {/* Deploy New Voting */}
          <div className="p-4 rounded-xl bg-deep-navy/50 border border-muted-blue/20 space-y-4">
            <div>
              <p className="text-white font-medium flex items-center gap-2">
                <Rocket className="w-4 h-4 text-soft-purple" />
                Deploy New Voting
              </p>
              <p className="text-xs text-muted-blue mt-1">
                Deploy a fresh contract on-chain with new candidates and duration.
              </p>
            </div>

            {/* Candidate inputs */}
            <div className="space-y-2">
              <p className="text-xs text-white font-medium">Candidates</p>
              {deployCandidates.map((name, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateDeployCandidate(i, e.target.value)}
                    placeholder={`Candidate ${i + 1}`}
                    className="flex-1 bg-deep-navy border border-muted-blue/30 rounded-lg px-3 py-1.5 text-sm text-white placeholder-muted-blue focus:outline-none focus:border-soft-purple"
                    disabled={deploying}
                  />
                  {deployCandidates.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCandidateRow(i)}
                      disabled={deploying}
                      className="text-muted-blue hover:text-red-400 p-1 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={addCandidateRow}
                disabled={deploying}
                className="text-muted-blue hover:text-soft-purple p-1 h-auto"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">Add Candidate</span>
              </Button>
            </div>

            {/* Duration */}
            <div className="flex gap-2 items-center">
              <label className="text-xs text-white font-medium min-w-[6rem]">Duration (min)</label>
              <input
                type="number"
                min={1}
                value={deployDuration}
                onChange={(e) => setDeployDuration(parseInt(e.target.value, 10) || 1)}
                className="w-24 bg-deep-navy border border-muted-blue/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-soft-purple"
                disabled={deploying}
              />
            </div>

            {/* Deploy button + status */}
            {deployError && (
              <p className="text-xs text-red-400">{deployError}</p>
            )}
            {deployResult && (
              <div className="space-y-1">
                <p className="text-xs text-green-400 font-medium">Deployed successfully!</p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-blue break-all font-mono">{deployResult.address}</p>
                  <button
                    onClick={() => copyAddress(deployResult.address)}
                    className="text-muted-blue hover:text-soft-purple flex-shrink-0"
                    title="Copy address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
            <Button
              variant="brand"
              size="sm"
              onClick={deployNewVoting}
              disabled={deploying || deployCandidates.filter((c) => c.trim()).length === 0}
              className="w-full"
            >
              {deploying ? "Deploying..." : "Deploy New Voting"}
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
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
