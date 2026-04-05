"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import VotingTable from "@/components/voting/VotingTable";
import ResultsPage from "@/components/results/ResultsPage";
import { useVoting } from "@/hooks/useVoting";

export default function ResultsPageWrapper() {
  const [page, setPage] = useState<"voting" | "results">("results");
  const { candidates, loadingCandidates, votingActive } = useVoting();
  const [showTable, setShowTable] = useState(false);

  if (loadingCandidates) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage={page} onNavigate={setPage} />
        <div className="flex-1 flex items-center justify-center text-muted-blue">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-muted-blue/30 border-t-muted-blue rounded-full mx-auto mb-4" />
            <p>Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header activePage={page} onNavigate={setPage} />

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-6">
        {votingActive && !showTable ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted-blue/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-blue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Voting Still Active</h2>
            <p className="text-muted-blue text-sm mb-6">
              Final results will be available once voting ends.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowTable(true)}
                className="px-6 py-3 rounded-xl bg-muted-blue/30 text-white font-medium text-sm hover:bg-muted-blue/50 transition"
              >
                View Live Table
              </button>
              <Link
                href="/voting"
                className="px-6 py-3 rounded-xl border border-muted-blue/40 text-white font-medium text-sm hover:border-soft-purple/60 transition"
              >
                Back to Vote
              </Link>
            </div>
          </div>
        ) : showTable ? (
          <div className="space-y-6">
            <Link href="/results" className="inline-block text-sm text-muted-blue hover:text-light-pink transition">
              Back to Results
            </Link>
            <VotingTable candidates={candidates} />
          </div>
        ) : (
          <div className="space-y-6">
            <ResultsPage candidates={candidates} />
            <div className="flex justify-center">
              <Link
                href="/voting"
                className="px-6 py-3 rounded-xl border border-muted-blue/40 text-white font-medium hover:border-soft-purple/60 transition"
              >
                Back to Vote
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
