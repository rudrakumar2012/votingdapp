"use client";

import { useState } from "react";
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
          Loading results...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header activePage={page} onNavigate={setPage} />

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-6">
        {votingActive && !showTable ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-3">Voting Still Active</h2>
            <p className="text-muted-blue text-sm mb-6">
              Final results will be available once voting ends.
            </p>
            <button
              onClick={() => setShowTable(true)}
              className="px-6 py-2 rounded-lg bg-muted-blue/30 text-white font-medium text-sm hover:bg-muted-blue/50 transition"
            >
              View Live Table
            </button>
          </div>
        ) : (
          showTable ? (
            <VotingTable candidates={candidates} />
          ) : (
            <ResultsPage candidates={candidates} />
          )
        )}
      </div>
    </div>
  );
}
