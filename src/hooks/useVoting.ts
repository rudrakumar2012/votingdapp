import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VOTING_ABI } from "@/lib/abi";
import { zeroAddress } from "viem";
import { useState, useEffect } from "react";

export function useContractAddress() {
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const refetch = () => setKey((k) => k + 1);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => setContractAddress(data.contractAddress ?? null))
      .catch(() => setContractAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? null));
  }, [key]);

  return { contractAddress, refetch };
}

export function useVoting() {
  const { address } = useAccount();
  const { contractAddress, refetch: refetchAddress } = useContractAddress();
  const addr = (contractAddress ?? "") as `0x${string}`;

  // Read candidate list
  const { data: candidates, isLoading: loadingCandidates, refetch } = useReadContract({
    address: addr,
    abi: VOTING_ABI,
    functionName: "getAllVotesOfCandiates",
    query: { refetchInterval: 5000, enabled: !!contractAddress },
  });

  // Check if user already voted
  const { data: hasVoted } = useReadContract({
    address: addr,
    abi: VOTING_ABI,
    functionName: "voters",
    args: address ? [address] : [zeroAddress],
    query: { enabled: !!address && !!contractAddress },
  }) as { data: boolean | undefined };

  // Check voting active
  const { data: votingActive } = useReadContract({
    address: addr,
    abi: VOTING_ABI,
    functionName: "getVotingStatus",
    query: { refetchInterval: 10000, enabled: !!contractAddress },
  });

  // Remaining time
  const { data: remainingTime } = useReadContract({
    address: addr,
    abi: VOTING_ABI,
    functionName: "getRemainingTime",
    query: { enabled: !!contractAddress },
  });

  // isEnded flag
  const { data: isEnded } = useReadContract({
    address: addr,
    abi: VOTING_ABI,
    functionName: "isEnded",
    query: { refetchInterval: 10000, enabled: !!contractAddress },
  });

  // Owner address
  const { data: owner } = useReadContract({
    address: addr,
    abi: VOTING_ABI,
    functionName: "owner",
    query: { enabled: !!contractAddress },
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
      address: addr,
      abi: VOTING_ABI,
      functionName: "endVoting",
      args: [],
      gas: BigInt(2_000_000),
    });
  }

  function addCandidate(name: string) {
    addCandidateWrite({
      address: addr,
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
      address: addr,
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
    refetchContract: refetchAddress,
  };
}
