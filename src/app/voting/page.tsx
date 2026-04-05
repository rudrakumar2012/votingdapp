"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Header from "@/components/layout/Header";
import CountdownTimer from "@/components/voting/CountdownTimer";
import CandidateSelector from "@/components/voting/CandidateSelector";
import VotingTable from "@/components/voting/VotingTable";
import TxStatusModal from "@/components/voting/TxStatusModal";
import { useVoting } from "@/hooks/useVoting";

export default function VotingPage() {
  const { isConnected } = useAccount();
  const [page, setPage] = useState<"voting" | "results">("voting");
  const {
    candidates,
    loadingCandidates,
    hasVoted,
    votingActive,
    remainingSeconds,
    voteForCandidate,
    txPending,
    confirming,
    confirmed,
    txError,
  } = useVoting();

  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  // Derive tx status
  let txStatus: "pending" | "confirming" | "confirmed" | "rejected" | null = null;
  if (txPending) txStatus = "pending";
  else if (confirming) txStatus = "confirming";
  else if (confirmed) txStatus = "confirmed";
  else if (txError) txStatus = "rejected";

  function handleVote() {
    if (!selectedCandidate) return;
    const index = candidates.findIndex((c) => c.name === selectedCandidate);
    if (index >= 0) voteForCandidate(index);
  }

  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage={page} onNavigate={setPage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header activePage={page} onNavigate={setPage} />

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-6 space-y-6">
        {/* Countdown */}
        <CountdownTimer initialSeconds={remainingSeconds} />

        {/* Status Banner */}
        {votingActive ? (
          hasVoted ? (
            <div className="text-center py-4 bg-muted-blue/20 rounded-xl border border-muted-blue/30">
              <p className="text-soft-purple font-semibold">You've already voted</p>
              <p className="text-sm text-muted-blue">Wait for results once voting ends</p>
            </div>
          ) : (
            <div className="text-center py-2 text-sm text-white font-medium bg-muted-blue/10 rounded-lg border border-muted-blue/20">
              Voting is active — cast your vote below!
            </div>
          )
        ) : (
          <div className="text-center py-4 bg-muted-blue/20 rounded-xl border border-muted-blue/30">
            <p className="text-soft-purple font-semibold">Voting is not active</p>
          </div>
        )}

        {/* Candidate Selector */}
        {loadingCandidates ? (
          <div className="text-center text-muted-blue py-8">Loading candidates...</div>
        ) : votingActive && !hasVoted ? (
          <>
            <CandidateSelector
              candidates={candidates}
              onSelect={setSelectedCandidate}
              selected={selectedCandidate}
            />
            <div className="flex justify-center pt-2">
              <button
                onClick={handleVote}
                disabled={!selectedCandidate}
                className={`px-8 py-3 rounded-xl font-semibold text-lg transition ${
                  selectedCandidate
                    ? "bg-soft-purple text-white hover:bg-soft-purple/80 shadow-lg shadow-soft-purple/30"
                    : "bg-muted-blue/30 text-muted-blue cursor-not-allowed"
                }`}
              >
                Submit Vote
              </button>
            </div>
          </>
        ) : (
          <VotingTable candidates={candidates} />
        )}
      </div>

      {/* Tx Status Modal */}
      {txStatus && (
        <TxStatusModal
          status={txStatus}
          txHash={null}
          candidateName={selectedCandidate}
          errorMsg={txError?.message ?? null}
          onClose={() => {}}
        />
      )}
    </div>
  );
}
