"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Check } from "lucide-react";
import { useState } from "react";

interface Candidate {
  name: string;
  voteCount: number;
}

interface ShareButtonProps {
  candidates: Candidate[];
  totalVotes: number;
  winner: string;
}

export default function ShareButton({ candidates, totalVotes, winner }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportJSON() {
    const payload = {
      election: "VoteChain Election",
      contract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
      timestamp: new Date().toISOString(),
      totalVotes,
      winner: { name: winner, votes: candidates.find((c) => c.name === winner)?.voteCount ?? 0 },
      results: candidates.map((c) => ({
        name: c.name,
        votes: c.voteCount,
        percentage: totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : "0.0",
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `election-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
      <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Copy Link
          </>
        )}
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-2">
        {exported ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            Exported!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export JSON
          </>
        )}
      </Button>
    </div>
  );
}
