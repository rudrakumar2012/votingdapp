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

  // isEnded flag
  const { data: isEnded } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VOTING_ABI,
    functionName: "isEnded",
    query: { refetchInterval: 10000 },
  });

  // Owner address
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VOTING_ABI,
    functionName: "owner",
  });


  // Vote write
  const { writeContract, data: txHash, isPending: txPending, error: txError } = useWriteContract();

  // End voting write
  const {
    writeContract: endVotingWrite,
    data: endVotingTxHash,
    isPending: endVotingPending,
    error: endVotingError,
  } = useWriteContract();

  // Add candidate write
  const {
    writeContract: addCandidateWrite,
    data: addCandidateTxHash,
    isPending: addCandidatePending,
    error: addCandidateError,
  } = useWriteContract();


  function endVoting() {
    endVotingWrite({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: VOTING_ABI,
      functionName: "endVoting",
      args: [],
      gas: BigInt(2_000_000),
    });
  }

  function addCandidate(name: string) {
    addCandidateWrite({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: VOTING_ABI,
      functionName: "addCandidate",
      args: [name],
      gas: BigInt(2_000_000),
    });
  }

  const {
    isLoading: endVotingConfirming,
    isSuccess: endVotingConfirmed,
  } = useWaitForTransactionReceipt({ hash: endVotingTxHash });

  const {
    isLoading: addCandidateConfirming,
    isSuccess: addCandidateConfirmed,
  } = useWaitForTransactionReceipt({ hash: addCandidateTxHash });

  const { isLoading: confirming, isSuccess: confirmed, data: receipt } = useWaitForTransactionReceipt({
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
    isEnded: !!isEnded,
    remainingSeconds: remainingTime ? Number(remainingTime) : 0,
    voteForCandidate,
    txPending,
    confirming,
    confirmed,
    txHash,
    owner,
    endVoting,
    endVotingTxHash,
    endVotingPending,
    endVotingConfirming,
    endVotingConfirmed,
    endVotingError,
    addCandidate,
    addCandidateTxHash,
    addCandidatePending,
    addCandidateConfirming,
    addCandidateConfirmed,
    addCandidateError,
    receiptBlockNumber: receipt ? Number(receipt.blockNumber) : null,
    txError,
    refetch,
  };
}
