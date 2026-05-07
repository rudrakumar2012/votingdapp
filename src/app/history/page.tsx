"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import Header from "@/components/layout/Header";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vote, ExternalLink, History, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface HistoryRecord {
  voterAddress: string;
  candidateIndex: number;
  candidateName: string;
  txHash: string;
  blockNumber: number;
  votedAt: string;
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function relativeTime(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function HistoryPage() {
  const { isConnected, address } = useAccount();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    fetch(`/api/voter/history?address=${address}`)
      .then((r) => r.json())
      .then((data) => setRecords(data.records ?? []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [address]);

  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage="history"  />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <Card className="border-muted-blue/30">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted-blue/10 border-2 border-muted-blue/30 flex items-center justify-center">
                  <Vote className="w-8 h-8 text-soft-purple" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
                  <p className="text-sm text-muted-blue mt-2">
                    Connect your wallet to view your voting history.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WalletConnectButton />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header activePage="history"  />
      <div className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/voting">
            <Button variant="ghost" size="sm" className="text-muted-blue hover:text-light-pink">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Vote
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-soft-purple" />
            Voting History
          </h1>
        </div>

        {loading ? (
          <div className="text-center text-muted-blue py-8 flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-muted-blue border-t-transparent rounded-full"
            />
            Loading your history...
          </div>
        ) : records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-muted-blue/20 bg-muted-blue/5">
              <CardContent className="text-center py-12">
                <Vote className="w-12 h-12 text-muted-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Votes Yet</h3>
                <p className="text-sm text-muted-blue mb-6">
                  Your voting history will appear here after you participate in an election.
                </p>
                <Link href="/voting">
                  <Button variant="brand">Cast Your First Vote</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {records.map((r, i) => (
              <motion.div
                key={r.txHash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-muted-blue/30 bg-muted-blue/5 hover:border-soft-purple/40 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{r.candidateName}</p>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${r.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-soft-purple hover:text-light-pink transition"
                        >
                          {shortenHash(r.txHash)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-xs text-muted-blue">
                          Block {r.blockNumber.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-left sm:text-right space-y-1 flex-shrink-0">
                        <Badge
                          variant="outline"
                          className="border-soft-purple/50 text-soft-purple text-xs"
                        >
                          #{r.candidateIndex}
                        </Badge>
                        <p className="text-xs text-muted-blue">
                          {relativeTime(r.votedAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

