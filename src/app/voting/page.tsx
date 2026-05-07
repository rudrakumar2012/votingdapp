"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Loader2 } from "lucide-react";
import CountdownTimer from "@/components/voting/CountdownTimer";
import CandidateSelector from "@/components/voting/CandidateSelector";
import TxStatusModal from "@/components/voting/TxStatusModal";
import VoteReceipt from "@/components/voting/VoteReceipt";
import StepWizard from "@/components/voting/StepWizard";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { useVoting } from "@/hooks/useVoting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const STEP_LABELS = ["Select Candidate", "Confirm Vote", "Done"];

export default function VotingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const {
    candidates,
    loadingCandidates,
    hasVoted,
    votingActive,
    isEnded,
    remainingSeconds,
    voteForCandidate,
    txPending,
    confirming,
    confirmed,
    txHash,
    txError,
    receiptBlockNumber,
  } = useVoting();
  const { address } = useAccount();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [receiptTs, setReceiptTs] = useState<Date | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const txActive = txPending || confirming || confirmed || !!txError;
  let txStatus: "pending" | "confirming" | "confirmed" | "rejected" | null = null;
  if (txPending) txStatus = "pending";
  else if (confirming) txStatus = "confirming";
  else if (confirmed) txStatus = "confirmed";
  else if (txError) txStatus = "rejected";

  // Voting ended results
  const [endedResults, setEndedResults] = useState<{ winner: string; votes: number; total: number } | null>(null);
  useEffect(() => {
    if (!votingActive) {
      fetch("/api/results")
        .then((r) => r.json())
        .then((data) =>
          setEndedResults({
            winner: data.winner?.name ?? "No votes cast",
            votes: data.winner?.votes ?? 0,
            total: data.totalVotes ?? 0,
          })
        )
        .catch(() => setEndedResults({ winner: "Unable to load", votes: 0, total: 0 }));
    }
  }, [votingActive]);

  // Auto-redirect to results after voting confirmed (receipt shown)
  useEffect(() => {
    if (receiptTs && !redirecting) {
      setRedirecting(true);
      const timer = setTimeout(() => router.push("/results"), 2000);
      return () => clearTimeout(timer);
    }
  }, [receiptTs, redirecting, router]);

  function handleNext() {
    if (step === 1 && selectedCandidate) setStep(2);
  }

  function handleConfirmVote() {
    if (!selectedCandidate) return;
    const index = candidates.findIndex((c) => c.name === selectedCandidate);
    if (index >= 0) voteForCandidate(index);
  }

  // Track when confirmation happens so we can capture the timestamp
  useEffect(() => {
    if (confirmed && !receiptTs) {
      setReceiptTs(new Date());
    }
  }, [confirmed, receiptTs]);

  if (!votingActive && !isEnded) {
    // Time expired but owner hasn't called endVoting() yet
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage="voting" />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="text-center py-10">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Time's Up</h2>
                <p className="text-muted-blue text-sm mb-6">
                  The voting period has expired. Waiting for the organizer to close the election.
                </p>
                <Link href="/results">
                  <Button variant="brand">View Live Results</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!votingActive && isEnded) {
    // Officially closed — show winner summary
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage="voting" />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <Card className="border-soft-purple/30 bg-gradient-to-b from-soft-purple/10 to-deep-navy/50">
              <CardContent className="text-center py-10 space-y-4">
                <FileText className="w-12 h-12 text-soft-purple mx-auto" />
                <h2 className="text-xl font-bold text-white">Voting Ended — Results Are In</h2>
                {endedResults && endedResults.winner !== "Unable to load" ? (
                  <div className="space-y-2">
                    <p className="text-muted-blue text-sm">Winner</p>
                    <p className="text-2xl font-extrabold text-soft-purple">{endedResults.winner}</p>
                    <p className="text-muted-blue text-sm">
                      {endedResults.votes} vote{endedResults.votes !== 1 ? "s" : ""} · {endedResults.total} total cast
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-muted-blue text-sm">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-muted-blue/30 border-t-muted-blue rounded-full mr-2"
                    />
                    Loading results...
                  </div>
                )}
                <Link href="/results">
                  <Button variant="brand">View Full Results</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Already voted
  if (hasVoted && !txActive) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage="voting" />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <Card className="border-soft-purple/30 bg-soft-purple/5">
              <CardContent className="text-center py-10">
                <CheckCircle className="w-12 h-12 text-soft-purple mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Vote Recorded!</h2>
                <p className="text-muted-blue text-sm mb-2">
                  Your vote has been submitted on-chain.
                </p>
                {selectedCandidate && (
                  <p className="text-soft-purple font-semibold text-base mb-6">
                    You voted for {selectedCandidate}
                  </p>
                )}
                <Link href="/results">
                  <Button variant="brand">View Results</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header activePage="voting" />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
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
          <div className="text-center py-16 space-y-4">
            <Loader2 className="w-10 h-10 text-soft-purple animate-spin mx-auto" />
            <p className="text-muted-blue">Loading voting session...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <AlertCircle className="w-10 h-10 text-muted-blue/50 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">No Active Election</h3>
              <p className="text-sm text-muted-blue max-w-md mx-auto">
                No voting session is currently available. Contact your admin to deploy a new election.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1 — Select Candidate */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Step 1: Choose Your Candidate</h3>
                  <p className="text-sm text-muted-blue">
                    Pick one candidate from the list below. You can only vote once.
                  </p>
                </div>
                <CandidateSelector
                  candidates={candidates}
                  onSelect={setSelectedCandidate}
                  selected={selectedCandidate}
                />
                <div className="flex justify-center pt-2">
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={handleNext}
                    disabled={!selectedCandidate}
                  >
                    Next: Review Vote
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Confirm Vote */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Step 2: Confirm Your Vote</h3>
                  <p className="text-sm text-muted-blue">
                    Review your selection before submitting. This action cannot be undone.
                  </p>
                </div>
                <Card className="max-w-sm mx-auto border-muted-blue/40">
                  <CardContent className="text-center py-10">
                    <p className="text-xs uppercase tracking-widest text-muted-blue mb-2">Voting For</p>
                    <p className="text-3xl font-bold text-white">{selectedCandidate}</p>
                    <p className="text-sm text-muted-blue mt-3">
                      This vote will be permanently recorded on the Sepolia blockchain.
                    </p>
                  </CardContent>
                </Card>
                <div className="flex items-start justify-center gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-left max-w-sm mx-auto">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-500/80">
                    One vote per wallet. You cannot change your vote once submitted.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                  >
                    Back to Selection
                  </Button>
                  <Button onClick={handleConfirmVote} variant="brand" size="lg">
                    Submit Vote
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Vote Receipt */}
            {step === 3 && confirmed && receiptTs && receiptBlockNumber != null && selectedCandidate && (
              <VoteReceipt
                txHash={txHash!}
                candidateName={selectedCandidate}
                voterAddress={address!}
                blockNumber={receiptBlockNumber}
                confirmedAt={receiptTs}
              />
            )}
            {step === 3 && (!confirmed || !receiptTs) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md mx-auto"
              >
                <Card className="border-soft-purple/30 bg-soft-purple/5">
                  <CardContent className="text-center py-10">
                    <CheckCircle className="w-12 h-12 text-soft-purple mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Vote Recorded!</h2>
                    <p className="text-muted-blue text-sm mb-6">
                      Your vote has been permanently stored on the Sepolia blockchain.
                    </p>
                    <Link href="/results">
                      <Button variant="brand">View Results</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
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
