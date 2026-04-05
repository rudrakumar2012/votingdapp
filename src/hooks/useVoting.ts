import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VOTING_ABI, CONTRACT_ADDRESS } from "@/lib/abi";
import { parseAbiItem, zeroAddress } from "viem";
import { useState, useEffect } from "react";

export function useVoting() {
  const { address } = useAccount();

  // Read candidate list
  const { data: candidates, isLoading: loadingCandidates, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VOTING_ABI,
    functionName: "getAllVotesOfCandiates",
    query: { refetchInterval: 5000 },
  });

  // Check if user already voted
  const { data: hasVoted } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VOTING_ABI,
    functionName: "voters",
    args: address ? [address] : [zeroAddress],
    query: { enabled: !!address },
  });

  // Check voting active
  const { data: votingActive } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VOTING_ABI,
    functionName: "getVotingStatus",
    query: { refetchInterval: 10000 },
  });

  // Remaining time
  const { data: remainingTime } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VOTING_ABI,
    functionName: "getRemainingTime",
  });

  // Vote write
  const { writeContract, data: txHash, isPending: txPending, error: txError } = useWriteContract();

  const { isLoading: confirming, isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function voteForCandidate(candidateIndex: number) {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: VOTING_ABI,
      functionName: "vote",
      args: [BigInt(candidateIndex)],
      gas: BigInt(2_000_000),
    });
  }

  const candidateList = candidates?.map((c) => ({
    name: c.name,
    voteCount: Number(c.voteCount),
  })) ?? [];

  return {
    candidates: candidateList,
    loadingCandidates,
    hasVoted: !!hasVoted,
    votingActive: !!votingActive,
    remainingSeconds: remainingTime ? Number(remainingTime) : 0,
    voteForCandidate,
    txPending,
    confirming,
    confirmed,
    txHash,
    txError,
    refetch,
  };
}
