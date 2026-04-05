"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import Header from "@/components/layout/Header";
import CountdownTimer from "@/components/voting/CountdownTimer";
import CandidateSelector from "@/components/voting/CandidateSelector";
import VotingTable from "@/components/voting/VotingTable";
import TxStatusModal from "@/components/voting/TxStatusModal";
import StepWizard from "@/components/voting/StepWizard";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { useVoting } from "@/hooks/useVoting";

const STEP_LABELS = ["Select Candidate", "Confirm Vote", "Done"];

export default function VotingPage() {
  const { isConnected } = useAccount();
  const [page, setPage] = useState<"voting" | "results">("voting");
  const [step, setStep] = useState<1 | 2 | 3>(1);
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

  const txActive = txPending || confirming || confirmed || !!txError;
  let txStatus: "pending" | "confirming" | "confirmed" | "rejected" | null = null;
  if (txPending) txStatus = "pending";
  else if (confirming) txStatus = "confirming";
  else if (confirmed) txStatus = "confirmed";
  else if (txError) txStatus = "rejected";

  function handleVote() {
    if (!selectedCandidate) return;
    const index = candidates.findIndex((c) => c.name === selectedCandidate);
    if (index >= 0) {
      voteForCandidate(index);
      setStep(2);
    }
  }

  function handleNext() {
    if (step === 1 && selectedCandidate) setStep(2);
  }

  function handleConfirmVote() {
    if (!selectedCandidate) return;
    const index = candidates.findIndex((c) => c.name === selectedCandidate);
    if (index >= 0) voteForCandidate(index);
  }

  // Wallet not connected
  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage={page} onNavigate={setPage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm mx-auto px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted-blue/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2H3v11h18V9h-4z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-muted-blue text-sm leading-relaxed mb-6">
              You need to connect an Ethereum wallet to vote. Make sure you're on the <strong className="text-light-pink">Sepolia testnet</strong>.
            </p>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  // Voting ended
  if (!votingActive) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage={page} onNavigate={setPage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm mx-auto px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-soft-purple/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-soft-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Voting Has Ended</h2>
            <p className="text-muted-blue text-sm mb-6">The voting session is complete. Check out the results.</p>
            <Link
              href="/results"
              className="px-6 py-3 rounded-xl bg-soft-purple text-white font-semibold hover:bg-soft-purple/80 transition"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Already voted
  if (hasVoted && !txActive) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage={page} onNavigate={setPage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm mx-auto px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-soft-purple/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-soft-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Vote Recorded!</h2>
            <p className="text-muted-blue text-sm mb-2">Your vote has been submitted on-chain.</p>
            {selectedCandidate && (
              <p className="text-soft-purple font-semibold text-base mb-6">You voted for {selectedCandidate}</p>
            )}
            <Link
              href="/results"
              className="px-6 py-3 rounded-xl bg-soft-purple text-white font-semibold hover:bg-soft-purple/80 transition"
            >
              View Results
            </Link>
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

        {/* Step Wizard */}
        <StepWizard
          currentStep={step}
          totalSteps={STEP_LABELS.length}
          labels={STEP_LABELS}
        />

        {/* Loading */}
        {loadingCandidates ? (
          <div className="text-center text-muted-blue py-8">Loading candidates...</div>
        ) : (
          <div className="space-y-6">
            {/* Step 1 — Select Candidate */}
            {step === 1 && (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Step 1: Choose Your Candidate</h3>
                <p className="text-sm text-muted-blue">
                  Pick one candidate from the list below. You can only vote once.
                </p>
                <CandidateSelector
                  candidates={candidates}
                  onSelect={setSelectedCandidate}
                  selected={selectedCandidate}
                />
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleNext}
                    disabled={!selectedCandidate}
                    className={`px-8 py-3 rounded-xl font-semibold text-lg transition ${
                      selectedCandidate
                        ? "bg-soft-purple text-white hover:bg-soft-purple/80 shadow-lg shadow-soft-purple/30"
                        : "bg-muted-blue/30 text-muted-blue cursor-not-allowed"
                    }`}
                  >
                    Next: Review Vote
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Confirm Vote */}
            {step === 2 && (
              <div className="space-y-6 text-center">
                <h3 className="text-xl font-bold text-white">Step 2: Confirm Your Vote</h3>
                <p className="text-sm text-muted-blue">
                  Review your selection before submitting. This action cannot be undone.
                </p>
                <div className="max-w-sm mx-auto p-8 rounded-2xl bg-muted-blue/10 border border-muted-blue/30">
                  <p className="text-xs uppercase tracking-widest text-muted-blue mb-2">Voting For</p>
                  <p className="text-3xl font-bold text-white">{selectedCandidate}</p>
                  <p className="text-sm text-muted-blue mt-3">
                    This vote will be permanently recorded on the Sepolia blockchain.
                  </p>
                </div>
                <div className="bg-muted-blue/5 rounded-xl p-4 border border-muted-blue/20 text-left">
                  <p className="text-sm text-muted-blue flex items-center gap-2">
                    <svg className="w-4 h-4 text-muted-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    One vote per wallet. You cannot change your vote once submitted.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl border border-muted-blue/40 text-white font-medium hover:border-muted-blue/60 transition"
                  >
                    Back to Selection
                  </button>
                  <button
                    onClick={handleConfirmVote}
                    className="px-8 py-3 rounded-xl bg-soft-purple text-white font-bold text-lg hover:bg-soft-purple/80 shadow-lg shadow-soft-purple/30 transition"
                  >
                    Submit Vote
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live table for viewers (not voting) */}
        {!hasVoted && step === 1 && loadingCandidates && (
          <VotingTable candidates={candidates} />
        )}
      </div>

      {/* Tx Status Modal */}
      {txActive && txStatus && (
        <TxStatusModal
          status={txStatus}
          txHash={null}
          candidateName={selectedCandidate}
          errorMsg={txError?.message ?? null}
          onClose={() => {
            if (confirmed) setStep(3);
          }}
        />
      )}
    </div>
  );
}
