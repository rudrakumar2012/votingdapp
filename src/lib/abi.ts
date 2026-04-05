export const VOTING_ABI = [
  { inputs: [{ internalType: "string[]", name: "_candidateNames", type: "string[]" }, { internalType: "uint256", name: "_durationInMinutes", type: "uint256" }], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [{ indexed: true, internalType: "address", name: "voter", type: "address" }, { indexed: true, internalType: "uint256", name: "candidateIndex", type: "uint256" }, { indexed: false, internalType: "string", name: "candidateName", type: "string" }], name: "VoteCast", type: "event" },
  { inputs: [{ indexed: false, internalType: "string", name: "winnerName", type: "string" }, { indexed: false, internalType: "uint256", name: "winningVoteCount", type: "uint256" }], name: "VotingEnded", type: "event" },
  { inputs: [{ internalType: "string", name: "_name", type: "string" }], name: "addCandidate", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_candidateIndex", type: "uint256" }], name: "vote", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "getAllVotesOfCandiates", outputs: [{ components: [{ internalType: "string", name: "name", type: "string" }, { internalType: "uint256", name: "voteCount", type: "uint256" }], internalType: "struct Voting.Candidate[]", name: "", type: "tuple[]" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getVotingStatus", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getRemainingTime", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getWinner", outputs: [{ internalType: "string", name: "winnerName", type: "string" }, { internalType: "uint256", name: "winningVoteCount", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "endVoting", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "votingEnd", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "votingStart", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "isEnded", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "candidates", outputs: [{ internalType: "string", name: "name", type: "string" }, { internalType: "uint256", name: "voteCount", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "voters", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
] as const;

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
