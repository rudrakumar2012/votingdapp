"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import VotingTable from "@/components/voting/VotingTable";
import ResultsPageComponent from "@/components/results/ResultsPage";
import { useVoting } from "@/hooks/useVoting";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsPageWrapper() {
  const { candidates, loadingCandidates, votingActive, isEnded } = useVoting();
  const [showTable, setShowTable] = useState(false);

  if (loadingCandidates) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage="results" />
        <div className="flex-1 flex items-center justify-center text-muted-blue">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-muted-blue/30 border-t-muted-blue rounded-full mx-auto mb-4"
            />
            <p>Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header activePage="results" />

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-6">
        {votingActive && !isEnded && !showTable ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Card className="border-muted-blue/30 max-w-md mx-auto">
              <CardContent className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted-blue/10 border-2 border-muted-blue/30 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Clock className="w-8 h-8 text-muted-blue" />
                  </motion.div>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Voting Still Active</h2>
                <p className="text-muted-blue text-sm mb-6">
                  Final results will be available once voting ends.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => setShowTable(true)}
                    variant="secondary"
                  >
                    View Live Table
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Link href="/voting">
                    <Button variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Vote
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : showTable ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link
              href="/results"
              className="inline-flex items-center text-sm text-muted-blue hover:text-light-pink transition"
              onClick={() => setShowTable(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Results
            </Link>
            <VotingTable candidates={candidates} />
          </motion.div>
        ) : (
          <div className="space-y-6">
            <ResultsPageComponent candidates={candidates} isEnded={isEnded} />
          </div>
        )}
      </div>
    </div>
  );
}
