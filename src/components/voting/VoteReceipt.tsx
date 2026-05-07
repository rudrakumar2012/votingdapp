"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  txHash: string;
  candidateName: string;
  voterAddress: string;
  blockNumber: number;
  confirmedAt: Date;
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function VoteReceipt({ txHash, candidateName, voterAddress, blockNumber, confirmedAt }: Props) {
  const [copied, setCopied] = useState(false);

  function copyReceipt() {
    const text = [
      `VoteChain — Vote Receipt`,
      `================================`,
      `Candidate:   ${candidateName}`,
      `Voter:       ${shortenAddress(voterAddress)}`,
      `Tx Hash:     ${txHash}`,
      `Block Number: ${blockNumber}`,
      `Confirmed at: ${confirmedAt.toISOString()}`,
      `================================`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const etherscanUrl = `https://sepolia.etherscan.io/tx/${txHash}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="border-soft-purple/30 bg-gradient-to-b from-soft-purple/10 to-deep-navy/50 max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <CardTitle className="text-xl text-white">Vote Confirmed!</CardTitle>
          </div>
          <Badge variant="outline" className="w-fit mx-auto border-soft-purple/50 text-muted-blue text-xs">
            Receipt
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-blue">Candidate</span>
              <span className="text-white font-semibold text-right">{candidateName}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-blue">Voter</span>
              <span className="text-soft-purple font-mono text-xs text-right">{shortenAddress(voterAddress)}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-blue">Block</span>
              <span className="text-white font-mono text-xs text-right">{blockNumber.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-blue">Time</span>
              <span className="text-white text-xs text-right">{confirmedAt.toLocaleTimeString()}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-blue">Transaction</span>
              <a
                href={etherscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-soft-purple hover:text-light-pink transition text-xs font-mono break-all"
              >
                {txHash}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={copyReceipt}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy Receipt"}
            </Button>
            <Link href="/results" className="w-full">
              <Button variant="brand" size="lg" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                View Live Results
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
